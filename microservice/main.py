#!/usr/bin/env python3
"""
User Routing Microservice - Main Entry Point
Modular FastAPI service for intelligent user-interviewer matching
"""

import uvicorn
import sys
import os

# Add the current directory to Python path so we can import the app package
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    from app.main import app
    
    if __name__ == "__main__":
        print("$$$ Starting User Routing Microservice...")
        print("$$$ Service will be available at: http://0.0.0.0:8000")
        print("$$$ API Documentation: http://0.0.0.0:8000/docs")
        
        uvicorn.run(
            "app.main:app",
            host="0.0.0.0",
            port=8000,
            reload=True
        )
        
except ImportError as e:
    print(f"[DEBUG] Import error: {e}")
    print("[DEBUG] Make sure you're running this from the microservice root directory")
    print("[DEBUG] Current working directory:", os.getcwd())
    sys.exit(1)
except Exception as e:
    print(f"[DEBUG] Error: {e}")
    sys.exit(1)
