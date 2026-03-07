from typing import Optional, Dict
from pydantic import BaseModel, Field, model_validator

class WeightScheme(BaseModel):
    skills: float
    experience: float

    @model_validator(mode="after")
    def validate_sum(self):
        total = self.skills + self.experience

        if abs(total - 0.7) > 0.01:
            raise ValueError(
                "skills + experience must equal 0.7 because semantic is fixed at 0.3"
            )

        return self

class JobCreate(BaseModel):
    title: str
    description: str
    weightage_scheme: WeightScheme | None = None


class JobOut(BaseModel):
    id: str
    title: str
    description: str
    required_skills: list
    min_experience: int
    weights: dict
    status: str
    created_at: str