"""
SOP Matching Engine
-------------------
Matches an inbound customer message to one of Closira's Standard Operating Procedures
using keyword-based rules. No AI required — fast, deterministic, and easy to extend.

SOPs:
  1. booking_enquiry    – customer wants to book / schedule / appointment
  2. pricing_question   – customer asking about cost / price / plans
  3. complaint          – customer unhappy / issue / problem / refund
  4. after_hours        – message received outside business hours (stub — always matches
                          if message contains "urgent" or "emergency" at night)
  5. general_info       – catch-all for product / feature / how-does-it-work questions
"""

from dataclasses import dataclass
from typing import Optional


@dataclass
class SOPMatch:
    sop_id: str
    sop_name: str
    suggested_response: str


_SOPS: list[dict] = [
    {
        "id": "booking_enquiry",
        "name": "Booking Enquiry",
        "keywords": ["book", "booking", "schedule", "appointment", "reserve", "slot", "availability", "available"],
        "response": (
            "Thank you for reaching out! We'd be happy to schedule a time for you. "
            "Please share your preferred date and time and we'll confirm availability within 1 business hour."
        ),
    },
    {
        "id": "pricing_question",
        "name": "Pricing Question",
        "keywords": ["price", "pricing", "cost", "plan", "plans", "fee", "charge", "how much", "subscription", "quote", "rate"],
        "response": (
            "Great question! Our plans start from ₹999/month for the Starter tier. "
            "I'll send you a full pricing breakdown shortly. Would you like to schedule a quick demo call?"
        ),
    },
    {
        "id": "complaint",
        "name": "Complaint / Issue",
        "keywords": ["complaint", "issue", "problem", "unhappy", "disappointed", "refund", "broken", "wrong", "error", "bug", "frustrated", "angry"],
        "response": (
            "I'm really sorry to hear you're experiencing this issue. "
            "Your concern has been flagged as high priority and a team member will reach out within 30 minutes to resolve this personally."
        ),
    },
    {
        "id": "after_hours",
        "name": "After-Hours Message",
        "keywords": ["urgent", "emergency", "asap", "immediately", "right now", "tonight", "midnight"],
        "response": (
            "We've received your urgent message and it has been flagged for immediate attention. "
            "Our on-call team will respond within 15 minutes."
        ),
    },
    {
        "id": "general_info",
        "name": "General Information",
        "keywords": ["what", "how", "does", "feature", "work", "tell me", "info", "information", "learn", "about", "details", "explain"],
        "response": (
            "Thanks for your interest in Closira! "
            "We're an AI-powered customer communication platform for SMBs — handling WhatsApp, email, and phone enquiries automatically. "
            "I'll have someone from our team share detailed information with you shortly."
        ),
    },
]


def match_sop(message: str) -> Optional[SOPMatch]:
    """
    Return the best-matching SOP for the given message, or None if no match found.

    Strategy: score each SOP by the number of keywords found in the message (case-insensitive).
    The SOP with the highest score wins. Ties go to whichever SOP appears first in the list
    (i.e. priority ordering matters).
    """
    msg_lower = message.lower()
    best_score = 0
    best_sop = None

    for sop in _SOPS:
        score = sum(1 for kw in sop["keywords"] if kw in msg_lower)
        if score > best_score:
            best_score = score
            best_sop = sop

    if best_sop is None or best_score == 0:
        return None

    return SOPMatch(
        sop_id=best_sop["id"],
        sop_name=best_sop["name"],
        suggested_response=best_sop["response"],
    )
