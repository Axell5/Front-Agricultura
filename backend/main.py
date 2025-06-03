from fastapi import FastAPI, HTTPException
from models import PaymentRequest
from payu_client import create_payment

app = FastAPI()

@app.post("/pago")
def pagar(payment: PaymentRequest):
    try:
        result = create_payment(payment)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
