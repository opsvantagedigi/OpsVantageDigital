from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(
    title="OpsVantage Digital API",
    description="Backend API for OpsVantage Digital - Premier AI-first digital agency",
    version="1.0.0"
)

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

class ContactForm(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    company: Optional[str] = None
    phone: Optional[str] = None
    service: Optional[str] = None
    message: str
    budget: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    status: str = Field(default="new")

class ContactFormCreate(BaseModel):
    name: str
    email: str
    company: Optional[str] = None
    phone: Optional[str] = None
    service: Optional[str] = None
    message: str
    budget: Optional[str] = None

class NewsletterSubscription(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    name: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    status: str = Field(default="active")

class NewsletterSubscriptionCreate(BaseModel):
    email: str
    name: Optional[str] = None

class ServiceInquiry(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    service_id: str
    client_name: str
    client_email: str
    client_phone: Optional[str] = None
    project_details: str
    budget_range: Optional[str] = None
    timeline: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    status: str = Field(default="pending")

class ServiceInquiryCreate(BaseModel):
    service_id: str
    client_name: str
    client_email: str
    client_phone: Optional[str] = None
    project_details: str
    budget_range: Optional[str] = None
    timeline: Optional[str] = None

class DigitalProduct(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    type: str  # 'ebook', 'course', 'subscription'
    price: float
    original_price: Optional[float] = None
    features: List[str]
    image_url: str
    rating: float = Field(default=5.0)
    is_bestseller: bool = Field(default=False)
    is_subscription: bool = Field(default=False)
    category: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = Field(default=True)

class ChatMessage(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str
    message: str
    response: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class ChatMessageCreate(BaseModel):
    session_id: str
    message: str

# Basic Routes
@api_router.get("/")
async def root():
    return {"message": "OpsVantage Digital API - Transforming businesses with AI-powered solutions"}

@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow()}

# Contact Form Routes
@api_router.post("/contact", response_model=ContactForm)
async def submit_contact_form(form_data: ContactFormCreate):
    """Submit a contact form inquiry"""
    try:
        contact_dict = form_data.dict()
        contact_obj = ContactForm(**contact_dict)
        
        # Save to database
        await db.contact_forms.insert_one(contact_obj.dict())
        
        # Here you would typically send an email notification
        # For now, we'll just log it
        logging.info(f"New contact form submission from {contact_obj.email}")
        
        return contact_obj
    except Exception as e:
        logging.error(f"Error submitting contact form: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to submit contact form")

@api_router.get("/contact", response_model=List[ContactForm])
async def get_contact_forms():
    """Get all contact form submissions (admin only)"""
    try:
        forms = await db.contact_forms.find().sort("timestamp", -1).to_list(100)
        return [ContactForm(**form) for form in forms]
    except Exception as e:
        logging.error(f"Error retrieving contact forms: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve contact forms")

# Newsletter Routes
@api_router.post("/newsletter/subscribe", response_model=NewsletterSubscription)
async def subscribe_newsletter(subscription_data: NewsletterSubscriptionCreate):
    """Subscribe to newsletter"""
    try:
        # Check if email already exists
        existing = await db.newsletter_subscriptions.find_one({"email": subscription_data.email})
        if existing:
            raise HTTPException(status_code=400, detail="Email already subscribed")
        
        subscription_dict = subscription_data.dict()
        subscription_obj = NewsletterSubscription(**subscription_dict)
        
        await db.newsletter_subscriptions.insert_one(subscription_obj.dict())
        
        logging.info(f"New newsletter subscription: {subscription_obj.email}")
        return subscription_obj
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error subscribing to newsletter: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to subscribe to newsletter")

# Service Inquiry Routes
@api_router.post("/services/inquiry", response_model=ServiceInquiry)
async def submit_service_inquiry(inquiry_data: ServiceInquiryCreate):
    """Submit a service inquiry"""
    try:
        inquiry_dict = inquiry_data.dict()
        inquiry_obj = ServiceInquiry(**inquiry_dict)
        
        await db.service_inquiries.insert_one(inquiry_obj.dict())
        
        logging.info(f"New service inquiry from {inquiry_obj.client_email} for service {inquiry_obj.service_id}")
        return inquiry_obj
    except Exception as e:
        logging.error(f"Error submitting service inquiry: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to submit service inquiry")

@api_router.get("/services/inquiries", response_model=List[ServiceInquiry])
async def get_service_inquiries():
    """Get all service inquiries (admin only)"""
    try:
        inquiries = await db.service_inquiries.find().sort("timestamp", -1).to_list(100)
        return [ServiceInquiry(**inquiry) for inquiry in inquiries]
    except Exception as e:
        logging.error(f"Error retrieving service inquiries: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve service inquiries")

# Digital Store Routes
@api_router.get("/store/products", response_model=List[DigitalProduct])
async def get_digital_products():
    """Get all active digital products"""
    try:
        products = await db.digital_products.find({"is_active": True}).sort("created_at", -1).to_list(100)
        return [DigitalProduct(**product) for product in products]
    except Exception as e:
        logging.error(f"Error retrieving digital products: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve products")

@api_router.get("/store/products/{product_id}", response_model=DigitalProduct)
async def get_digital_product(product_id: str):
    """Get a specific digital product"""
    try:
        product = await db.digital_products.find_one({"id": product_id, "is_active": True})
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        return DigitalProduct(**product)
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error retrieving product {product_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve product")

# Chat Bot Routes
@api_router.post("/chat", response_model=Dict[str, Any])
async def chat_with_bot(message_data: ChatMessageCreate):
    """Chat with AI assistant"""
    try:
        # Simple response logic - in production, this would integrate with AI service
        user_message = message_data.message.lower()
        
        # Predefined responses based on keywords
        if any(word in user_message for word in ['service', 'services', 'help', 'what']):
            response = "I can help you learn about our services! We offer AI Integration, Web Development, Mobile Apps, Digital Strategy, Performance Marketing, and Custom Software. Which interests you most?"
        elif any(word in user_message for word in ['price', 'cost', 'pricing', 'quote']):
            response = "Our pricing varies based on project scope. We offer packages starting from $1,500 for marketing, $3,000 for web development, and $5,000 for AI integration. Would you like to schedule a consultation for a detailed quote?"
        elif any(word in user_message for word in ['ai', 'artificial', 'intelligence', 'automation']):
            response = "We're specialists in AI integration! We can help automate your business processes, implement chatbots, build predictive analytics, and create custom AI solutions. What specific AI needs do you have?"
        elif any(word in user_message for word in ['web', 'website', 'development']):
            response = "We build modern, responsive websites using the latest technologies like React, Next.js, and Node.js. Our websites are fast, SEO-optimized, and mobile-friendly. What kind of website are you looking for?"
        elif any(word in user_message for word in ['contact', 'call', 'meeting', 'consultation']):
            response = "I'd be happy to connect you with our team! You can call us at +64 21 183 5253, email contact@opsvantagedigital.online, or fill out our contact form. We offer free initial consultations!"
        elif any(word in user_message for word in ['portfolio', 'work', 'examples', 'projects']):
            response = "Check out our portfolio page to see our latest projects! We've built AI-powered e-commerce platforms, mobile banking apps, healthcare systems, and more. Each project showcases our technical expertise and results-driven approach."
        else:
            response = "Thanks for your message! I'm here to help with any questions about our services, pricing, or how we can help transform your business with AI and modern technology. What would you like to know?"
        
        # Save chat message
        chat_obj = ChatMessage(
            session_id=message_data.session_id,
            message=message_data.message,
            response=response
        )
        
        await db.chat_messages.insert_one(chat_obj.dict())
        
        return {
            "response": response,
            "session_id": message_data.session_id,
            "timestamp": datetime.utcnow()
        }
    except Exception as e:
        logging.error(f"Error processing chat message: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to process message")

# Analytics Routes
@api_router.get("/analytics/overview")
async def get_analytics_overview():
    """Get basic analytics overview (admin only)"""
    try:
        contact_forms_count = await db.contact_forms.count_documents({})
        newsletter_subs_count = await db.newsletter_subscriptions.count_documents({"status": "active"})
        service_inquiries_count = await db.service_inquiries.count_documents({})
        chat_messages_count = await db.chat_messages.count_documents({})
        
        return {
            "contact_forms": contact_forms_count,
            "newsletter_subscribers": newsletter_subs_count,
            "service_inquiries": service_inquiries_count,
            "chat_interactions": chat_messages_count,
            "generated_at": datetime.utcnow()
        }
    except Exception as e:
        logging.error(f"Error retrieving analytics: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve analytics")

# Legacy status check routes (keeping for compatibility)
@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# Include the router in the main app
app.include_router(api_router)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_event():
    """Initialize database with sample data if needed"""
    try:
        # Check if digital products exist, if not, create sample products
        products_count = await db.digital_products.count_documents({})
        if products_count == 0:
            sample_products = [
                {
                    "id": str(uuid.uuid4()),
                    "title": "AI Business Transformation Guide",
                    "description": "Complete guide to implementing AI in your business operations",
                    "type": "E-book",
                    "price": 49.99,
                    "original_price": 79.99,
                    "features": ["150+ pages", "Case studies", "Implementation templates", "Video tutorials"],
                    "image_url": "https://images.unsplash.com/photo-1677442136019-21780ecad995",
                    "rating": 4.9,
                    "is_bestseller": True,
                    "is_subscription": False,
                    "category": "AI",
                    "created_at": datetime.utcnow(),
                    "is_active": True
                },
                {
                    "id": str(uuid.uuid4()),
                    "title": "Complete Web Development Masterclass",
                    "description": "Master modern web development with React, Node.js, and more",
                    "type": "Course",
                    "price": 199.99,
                    "original_price": 299.99,
                    "features": ["40+ hours content", "Hands-on projects", "Lifetime access", "Certificate"],
                    "image_url": "https://images.unsplash.com/photo-1654618977232-a6c6dea9d1e8",
                    "rating": 4.8,
                    "is_bestseller": False,
                    "is_subscription": False,
                    "category": "Web Development",
                    "created_at": datetime.utcnow(),
                    "is_active": True
                },
                {
                    "id": str(uuid.uuid4()),
                    "title": "Digital Marketing Automation Toolkit",
                    "description": "Automate your marketing with proven templates and strategies",
                    "type": "Course + Templates",
                    "price": 149.99,
                    "original_price": 199.99,
                    "features": ["50+ templates", "Automation workflows", "Analytics dashboards", "Support"],
                    "image_url": "https://images.unsplash.com/photo-1666698809123-44e998e93f23",
                    "rating": 4.7,
                    "is_bestseller": False,
                    "is_subscription": False,
                    "category": "Marketing",
                    "created_at": datetime.utcnow(),
                    "is_active": True
                },
                {
                    "id": str(uuid.uuid4()),
                    "title": "Premium Agency Subscription",
                    "description": "Monthly access to all courses, templates, and exclusive content",
                    "type": "Subscription",
                    "price": 97.00,
                    "features": ["All courses included", "Monthly new content", "Live Q&A sessions", "Priority support"],
                    "image_url": "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
                    "rating": 4.9,
                    "is_bestseller": False,
                    "is_subscription": True,
                    "category": "Subscription",
                    "created_at": datetime.utcnow(),
                    "is_active": True
                }
            ]
            
            await db.digital_products.insert_many(sample_products)
            logger.info("Sample digital products created")
        
        logger.info("OpsVantage Digital API started successfully")
        
    except Exception as e:
        logger.error(f"Error during startup: {str(e)}")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
    logger.info("Database connection closed")