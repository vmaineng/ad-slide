from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
 
from .routes import router
 
app = FastAPI(title="Mock Ad Server")
 
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
     allow_private_network=True,
)
 
app.include_router(router)