#!/usr/bin/env bash
# Closira API — curl smoke tests
# Run:  chmod +x curl_tests.sh && ./curl_tests.sh
# Requires: curl, jq

BASE="http://localhost:8000"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Closira API — curl smoke tests"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# ── 1. Health ────────────────────────────────────────────────────────────────
echo -e "\n[1] GET /health"
curl -s "$BASE/health" | jq .

# ── 2. Create pricing enquiry ────────────────────────────────────────────────
echo -e "\n[2] POST /enquiry (pricing question)"
RESPONSE=$(curl -s -X POST "$BASE/enquiry" \
  -H "Content-Type: application/json" \
  -d '{
    "customer_name": "Sarah M.",
    "channel": "whatsapp",
    "message": "Hi, what are your pricing plans? How much does the premium plan cost?"
  }')
echo "$RESPONSE" | jq .
ENQUIRY_ID=$(echo "$RESPONSE" | jq -r '.job_id')
echo "  → Enquiry ID: $ENQUIRY_ID"

# ── 3. Wait for background task then get history ─────────────────────────────
echo -e "\n[3] Waiting 1s for background task..."
sleep 1

echo -e "\n[3] GET /enquiry/$ENQUIRY_ID/history"
curl -s "$BASE/enquiry/$ENQUIRY_ID/history" | jq .

# ── 4. Schedule follow-up ────────────────────────────────────────────────────
echo -e "\n[4] POST /enquiry/$ENQUIRY_ID/followup"
curl -s -X POST "$BASE/enquiry/$ENQUIRY_ID/followup" \
  -H "Content-Type: application/json" \
  -d '{
    "delay_minutes": 30,
    "message_template": "Hi {name}, following up on your pricing enquiry!"
  }' | jq .

# ── 5. Escalate ──────────────────────────────────────────────────────────────
echo -e "\n[5] Create booking enquiry then escalate it"
ENQID2=$(curl -s -X POST "$BASE/enquiry" \
  -H "Content-Type: application/json" \
  -d '{
    "customer_name": "Ravi Kumar",
    "channel": "email",
    "message": "I want to book a demo slot for next Tuesday morning."
  }' | jq -r '.job_id')

sleep 1

curl -s -X POST "$BASE/enquiry/$ENQID2/escalate" \
  -H "Content-Type: application/json" \
  -d '{"reason": "Customer requested a senior sales rep specifically."}' | jq .

# ── 6. Unmatched → auto-escalate ─────────────────────────────────────────────
echo -e "\n[6] POST /enquiry (unmatched message → auto-escalate)"
ENQID3=$(curl -s -X POST "$BASE/enquiry" \
  -H "Content-Type: application/json" \
  -d '{
    "customer_name": "Mystery User",
    "channel": "call",
    "message": "xyzzy blorp flarble zoop"
  }' | jq -r '.job_id')

sleep 1
echo "  → Unmatched enquiry ID: $ENQID3"
curl -s "$BASE/enquiry/$ENQID3/history" | jq '{status: .status, escalation_reason: .escalation_reason, timeline: [.timeline[].event_type]}'

# ── 7. 404 error ─────────────────────────────────────────────────────────────
echo -e "\n[7] GET /enquiry/nonexistent-id/history (expect 404)"
curl -s "$BASE/enquiry/nonexistent-id/history" | jq .

echo -e "\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  All tests done!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
