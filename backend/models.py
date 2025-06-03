from pydantic import BaseModel

class PaymentRequest(BaseModel):
    referenceCode: str
    description: str
    amount: float
    currency: str = "COP"
    buyerEmail: str
