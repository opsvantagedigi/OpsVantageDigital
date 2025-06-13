import requests
import json
import uuid
import time
from datetime import datetime

# Get the backend URL from the frontend .env file
BACKEND_URL = "https://f7e40010-2042-4d5f-9e68-384f0a30f42f.preview.emergentagent.com/api"

def test_endpoint(method, endpoint, data=None, expected_status=200, test_name=""):
    """
    Test an API endpoint and return the result
    """
    url = f"{BACKEND_URL}{endpoint}"
    headers = {"Content-Type": "application/json"}
    
    print(f"\n{'='*80}")
    print(f"Testing: {test_name or endpoint}")
    print(f"URL: {url}")
    print(f"Method: {method}")
    if data:
        print(f"Data: {json.dumps(data, indent=2)}")
    
    try:
        if method.lower() == "get":
            response = requests.get(url, headers=headers)
        elif method.lower() == "post":
            response = requests.post(url, headers=headers, json=data)
        else:
            print(f"Unsupported method: {method}")
            return False, None
        
        print(f"Status Code: {response.status_code} (Expected: {expected_status})")
        
        try:
            response_data = response.json()
            print(f"Response: {json.dumps(response_data, indent=2, default=str)}")
        except:
            print(f"Response: {response.text}")
            response_data = response.text
        
        if response.status_code == expected_status:
            print("✅ Test PASSED")
            return True, response_data
        else:
            print("❌ Test FAILED - Unexpected status code")
            return False, response_data
            
    except Exception as e:
        print(f"❌ Test FAILED - Exception: {str(e)}")
        return False, None

def run_all_tests():
    """
    Run all API tests
    """
    results = {}
    
    # 1. Core API health check endpoints
    results["root_endpoint"] = test_endpoint("GET", "/", expected_status=200, test_name="Main API health check")
    results["health_endpoint"] = test_endpoint("GET", "/health", expected_status=200, test_name="Health status endpoint")
    
    # 2. Contact and Communication endpoints
    contact_data = {
        "name": "John Smith",
        "email": "john.smith@example.com",
        "company": "Acme Corp",
        "phone": "+1234567890",
        "service": "Web Development",
        "message": "I need a new website for my business",
        "budget": "$5,000-$10,000"
    }
    results["submit_contact"] = test_endpoint("POST", "/contact", data=contact_data, expected_status=200, test_name="Submit contact form")
    results["get_contacts"] = test_endpoint("GET", "/contact", expected_status=200, test_name="Retrieve contact forms")
    
    # 3. Newsletter subscription
    newsletter_data = {
        "email": f"subscriber_{int(time.time())}@example.com",
        "name": "Newsletter Subscriber"
    }
    results["newsletter_subscribe"] = test_endpoint("POST", "/newsletter/subscribe", data=newsletter_data, expected_status=200, test_name="Subscribe to newsletter")
    
    # 4. Service inquiry
    service_inquiry_data = {
        "service_id": "web-development",
        "client_name": "Jane Doe",
        "client_email": "jane.doe@example.com",
        "client_phone": "+9876543210",
        "project_details": "I need a custom e-commerce website with payment integration",
        "budget_range": "$10,000-$20,000",
        "timeline": "3 months"
    }
    results["service_inquiry"] = test_endpoint("POST", "/services/inquiry", data=service_inquiry_data, expected_status=200, test_name="Submit service inquiry")
    results["get_service_inquiries"] = test_endpoint("GET", "/services/inquiries", expected_status=200, test_name="Get service inquiries")
    
    # 5. Digital Store endpoints
    results["get_products"] = test_endpoint("GET", "/store/products", expected_status=200, test_name="Get all digital products")
    
    # Get a specific product (using the first product from the list if available)
    success, products_data = results["get_products"]
    if success and products_data and len(products_data) > 0:
        product_id = products_data[0]["id"]
        results["get_product_by_id"] = test_endpoint("GET", f"/store/products/{product_id}", expected_status=200, test_name=f"Get specific product (ID: {product_id})")
    
    # 6. Chat Bot endpoint
    chat_data = {
        "session_id": str(uuid.uuid4()),
        "message": "What services do you offer?"
    }
    results["chat_services"] = test_endpoint("POST", "/chat", data=chat_data, expected_status=200, test_name="Chat with AI assistant - Services question")
    
    chat_data = {
        "session_id": str(uuid.uuid4()),
        "message": "How much does web development cost?"
    }
    results["chat_cost"] = test_endpoint("POST", "/chat", data=chat_data, expected_status=200, test_name="Chat with AI assistant - Cost question")
    
    # 7. Analytics endpoint
    results["analytics_overview"] = test_endpoint("GET", "/analytics/overview", expected_status=200, test_name="Get analytics overview")
    
    # 8. Legacy endpoints
    status_data = {
        "client_name": "Test Client"
    }
    results["create_status"] = test_endpoint("POST", "/status", data=status_data, expected_status=200, test_name="Create status check")
    results["get_status"] = test_endpoint("GET", "/status", expected_status=200, test_name="Get status checks")
    
    # Print summary
    print("\n" + "="*80)
    print("TEST SUMMARY")
    print("="*80)
    
    passed = 0
    failed = 0
    
    for test_name, (success, _) in results.items():
        status = "✅ PASSED" if success else "❌ FAILED"
        print(f"{test_name}: {status}")
        if success:
            passed += 1
        else:
            failed += 1
    
    print(f"\nTotal: {passed + failed}, Passed: {passed}, Failed: {failed}")
    print(f"Success Rate: {passed/(passed + failed) * 100:.2f}%")
    
    return results

if __name__ == "__main__":
    print(f"Testing OpsVantage Digital Backend API")
    print(f"Backend URL: {BACKEND_URL}")
    print(f"Timestamp: {datetime.now()}")
    print("="*80)
    
    run_all_tests()
