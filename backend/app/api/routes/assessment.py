from fastapi import APIRouter, Depends

from app.api.deps import get_current_user
from app.models.user import User
from app.security_engine.engine import SecurityRuleEngine
from app.security_engine.schema import (IPsecConfig, SecurityAssessmentResult)

router = APIRouter()
engine = SecurityRuleEngine()


@router.post("/config", response_model=SecurityAssessmentResult)
def assess_config(config: IPsecConfig, user: User = Depends(get_current_user)):
    return engine.evaluate(config)
