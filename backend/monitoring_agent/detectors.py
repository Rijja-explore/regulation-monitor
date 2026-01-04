"""
PAN (Primary Account Number) detection engine
Deterministic regex-based detection with Luhn validation
"""
import re
from typing import Optional, List


class PANDetector:
    """Detects unmasked PAN (16-digit card numbers) in text"""
    
    # Regex pattern for 16-digit sequences with optional spaces/dashes
    # Matches patterns like: 4111111111111111, 4111-1111-1111-1111, 4111 1111 1111 1111
    PAN_PATTERN = re.compile(r'\b(\d{4}[\s\-]?\d{4}[\s\-]?\d{4}[\s\-]?\d{4})\b')
    
    # Pattern to identify masked PANs (e.g., **** **** **** 1234)
    MASKED_PATTERN = re.compile(r'[\*]{4}[\s\-]?[\*]{4}[\s\-]?[\*]{4}[\s\-]?\d{4}')
    
    @staticmethod
    def luhn_check(card_number: str) -> bool:
        """
        Validate card number using Luhn algorithm
        Returns True if valid, False otherwise
        """
        # Remove spaces and dashes
        digits = card_number.replace(' ', '').replace('-', '')
        
        if not digits.isdigit() or len(digits) != 16:
            return False
        
        # Luhn algorithm
        total = 0
        reverse_digits = digits[::-1]
        
        for i, digit in enumerate(reverse_digits):
            n = int(digit)
            if i % 2 == 1:  # Every second digit from right
                n *= 2
                if n > 9:
                    n -= 9
            total += n
        
        return total % 10 == 0
    
    def detect(self, text: str) -> Optional[str]:
        """
        Detect unmasked PAN in text
        
        Args:
            text: Input text to scan
            
        Returns:
            Matched PAN string if found, None otherwise
        """
        # First check if text contains masked PANs - if so, it's intentionally masked
        if self.MASKED_PATTERN.search(text):
            return None
        
        # Search for potential PANs
        matches = self.PAN_PATTERN.findall(text)
        
        for match in matches:
            # Validate with Luhn check
            if self.luhn_check(match):
                return match
        
        return None
    
    def detect_all(self, text: str) -> List[str]:
        """
        Detect all unmasked PANs in text
        
        Args:
            text: Input text to scan
            
        Returns:
            List of matched PAN strings
        """
        if self.MASKED_PATTERN.search(text):
            return []
        
        matches = self.PAN_PATTERN.findall(text)
        valid_pans = []
        
        for match in matches:
            if self.luhn_check(match):
                valid_pans.append(match)
        
        return valid_pans
