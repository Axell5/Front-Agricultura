import os
import requests
import hashlib
from dotenv import load_dotenv
from models import PaymentRequest

load_dotenv()

API_KEY = os.getenv("PAYU_API_KEY")
API_LOGIN = os.getenv("PAYU_API_LOGIN")
ACCOUNT_ID = os.getenv("PAYU_ACCOUNT_ID")
MERCHANT_ID = os.getenv("PAYU_MERCHANT_ID")
IS_SANDBOX = os.getenv("PAYU_SANDBOX") == "True"

PAYU_URL = "https://sandbox.api.payulatam.com/payments-api/4.0/service.cgi" if IS_SANDBOX     else "https://api.payulatam.com/payments-api/4.0/service.cgi"

def generate_signature(reference_code: str, amount: float, currency: str):
    value_str = f"{API_KEY}~{MERCHANT_ID}~{reference_code}~{amount:.1f}~{currency}"
    return hashlib.md5(value_str.encode()).hexdigest()

def create_payment(payment: PaymentRequest):
    signature = generate_signature(payment.referenceCode, payment.amount, payment.currency)
    payload = {
        "language": "es",
        "command": "SUBMIT_TRANSACTION",
        "merchant": {
            "apiKey": API_KEY,
            "apiLogin": API_LOGIN
        },
        "transaction": {
            "order": {
                "accountId": ACCOUNT_ID,
                "referenceCode": payment.referenceCode,
                "description": payment.description,
                "language": "es",
                "signature": signature,
                "additionalValues": {
                    "TX_VALUE": {
                        "value": payment.amount,
                        "currency": payment.currency
                    }
                },
                "buyer": {
                    "emailAddress": payment.buyerEmail
                }
            },
            "type": "AUTHORIZATION_AND_CAPTURE",
            "paymentMethod": "VISA",
            "paymentCountry": "CO"
        },
        "test": IS_SANDBOX
    }

    headers = {
        "Content-Type": "application/json"
    }

    response = requests.post(PAYU_URL, json=payload, headers=headers)
    return response.json()
