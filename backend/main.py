"""
Regulatory Intelligence & RAG API
Main FastAPI application entry point
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging
from typing import List

from app.models.schemas import (
    QueryRequest,
    QueryResponse,
    IngestRequest,
    IngestResponse,
    Obligation,
    ObligationsResponse
)
from app.services.rag_service import RAGService
from app.services.ingestion_service import IngestionService

# Import Cognitive Agent router
from cognitive_agent.api import router as cognitive_agent_router

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Global service instances
rag_service: RAGService = None
ingestion_service: IngestionService = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle management for FastAPI application"""
    global rag_service, ingestion_service
    
    logger.info("🚀 Initializing Regulatory Intelligence & RAG System...")
    
    # Initialize services
    rag_service = RAGService()
    ingestion_service = IngestionService(rag_service)
    
    # Auto-ingest mock regulatory data on startup
    logger.info("📚 Loading mock regulatory data...")
    await ingestion_service.ingest_mock_regulations()
    
    logger.info("✅ System ready!")
    
    yield
    
    logger.info("🔴 Shutting down...")


# Create FastAPI app
app = FastAPI(
    title="Regulatory Intelligence & RAG API",
    description="Compliance knowledge base with RAG for autonomous agents",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Cognitive Agent routes
app.include_router(cognitive_agent_router)


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "operational",
        "service": "Regulatory Intelligence & Cognitive Compliance Platform",
        "version": "1.0.0",
        "total_obligations": len(rag_service.get_all_obligations()) if rag_service else 0,
        "modules": ["RAG", "Cognitive Agent", "Remediation", "Evidence"]
    }


@app.post("/regulations/query", response_model=QueryResponse)
async def query_regulations(request: QueryRequest):
    """
    Query the regulatory knowledge base using RAG
    
    Example:
        POST /regulations/query
        {
            "question": "Is PAN allowed in application logs?"
        }
    
    Returns:
        {
            "answer": "No. PCI-DSS 3.2.1 prohibits storage of PAN in logs.",
            "obligations": ["PCI_3_2_1_MASK_PAN"],
            "confidence": 0.94
        }
    """
    try:
        logger.info(f"📊 RAG Query: {request.question}")
        
        if not rag_service:
            raise HTTPException(status_code=503, detail="RAG service not initialized")
        
        response = await rag_service.query(request.question, top_k=request.top_k or 5)
        
        logger.info(f"✅ Query completed. Confidence: {response['confidence']:.2f}")
        
        return QueryResponse(**response)
        
    except Exception as e:
        logger.error(f"❌ Query error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Query failed: {str(e)}")


@app.post("/regulations/ingest", response_model=IngestResponse)
async def ingest_regulations(request: IngestRequest):
    """
    Ingest new regulatory documents
    
    Example:
        POST /regulations/ingest
        {
            "source": "PCI-DSS",
            "content": "Requirement 3: Protect stored cardholder data...",
            "metadata": {
                "regulation": "PCI-DSS",
                "version": "4.0"
            }
        }
    """
    try:
        logger.info(f"📥 Ingesting: {request.source}")
        
        if not ingestion_service:
            raise HTTPException(status_code=503, detail="Ingestion service not initialized")
        
        result = await ingestion_service.ingest_document(
            source=request.source,
            content=request.content,
            metadata=request.metadata or {}
        )
        
        logger.info(f"✅ Ingested {result['chunks_created']} chunks, {result['obligations_extracted']} obligations")
        
        return IngestResponse(**result)
        
    except Exception as e:
        logger.error(f"❌ Ingestion error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Ingestion failed: {str(e)}")


@app.get("/regulations/obligations", response_model=ObligationsResponse)
async def get_obligations(
    regulation: str = None,
    severity: str = None,
    data_type: str = None
):
    """
    Get all obligations with optional filtering
    
    Query params:
        regulation: Filter by regulation (e.g., "PCI-DSS")
        severity: Filter by severity (CRITICAL, HIGH, MEDIUM, LOW)
        data_type: Filter by data type (e.g., "PAN")
    
    Example:
        GET /regulations/obligations?regulation=PCI-DSS&severity=CRITICAL
    """
    try:
        if not rag_service:
            raise HTTPException(status_code=503, detail="RAG service not initialized")
        
        obligations = rag_service.get_all_obligations()
        
        # Apply filters
        if regulation:
            obligations = [o for o in obligations if o.regulation == regulation]
        
        if severity:
            obligations = [o for o in obligations if o.severity == severity.upper()]
        
        if data_type:
            obligations = [o for o in obligations if data_type.upper() in o.data_types]
        
        logger.info(f"📋 Returning {len(obligations)} obligations")
        
        return ObligationsResponse(
            total=len(obligations),
            obligations=obligations
        )
        
    except Exception as e:
        logger.error(f"❌ Get obligations error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to retrieve obligations: {str(e)}")


@app.get("/regulations/statistics")
async def get_statistics():
    """Get regulatory knowledge base statistics"""
    try:
        if not rag_service:
            raise HTTPException(status_code=503, detail="RAG service not initialized")
        
        stats = rag_service.get_statistics()
        return stats
        
    except Exception as e:
        logger.error(f"❌ Statistics error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to get statistics: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
