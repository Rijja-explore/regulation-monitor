"""
Autonomous Compliance AI for Visa
Agentic AI-Enabled Continuous PCI-DSS Compliance Platform

Main FastAPI Application Entry Point
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging
from pathlib import Path

# Import all agent routers
from monitoring_agent.api import router as monitoring_router
from cognitive_agent.api import router as cognitive_router  
from evidence_layer.api import router as evidence_router
from audit_layer.api import router as audit_router

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle management for FastAPI application"""
    logger.info("🚀 Initializing Autonomous Compliance AI for Visa...")
    logger.info("📦 Tenant: VISA | Regulation: PCI-DSS")
    
    # Ensure data directory exists
    data_dir = Path("data")
    data_dir.mkdir(exist_ok=True)
    (data_dir / "violations.json").touch(exist_ok=True)
    (data_dir / "evidence.json").touch(exist_ok=True)
    
    logger.info("✅ System ready!")
    
    yield
    
    logger.info("🔴 Shutting down...")


# Create FastAPI app
app = FastAPI(
    title="Autonomous Compliance AI for Visa",
    description="Agentic AI-powered continuous compliance monitoring with real-time PCI-DSS violation detection, LLM-driven reasoning, and tamper-evident audit trails",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001", 
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all agent routers
app.include_router(monitoring_router)
app.include_router(cognitive_router)
app.include_router(evidence_router)
app.include_router(audit_router)


@app.get("/")
async def root():
    """Root health check endpoint"""
    return {
        "status": "operational",
        "service": "Autonomous Compliance AI for Visa",
        "version": "1.0.0",
        "tenant": "VISA",
        "regulation_scope": "PCI-DSS",
        "capabilities": [
            "Real-time PAN detection",
            "LLM-driven reasoning (OpenRouter)",
            "Autonomous remediation",
            "Tamper-evident audit trails",
            "Evidence generation"
        ],
        "endpoints": {
            "monitoring": "/monitor/*",
            "cognitive": "/agent/*",
            "evidence": "/evidence/*",
            "audit": "/audit/*"
        }
    }


@app.get("/health")
async def health():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "Autonomous Compliance AI",
        "modules": {
            "monitoring_agent": "operational",
            "cognitive_agent": "operational",
            "evidence_layer": "operational",
            "audit_layer": "operational"
        }
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
