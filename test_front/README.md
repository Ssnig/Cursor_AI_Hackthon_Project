# FoodLoop backend test harness

Minimal example page to click through Person B’s backend logic.
Not the real product UI.

## Run

```bash
cd test_front
npm install
npm run dev
```

Open http://localhost:5173/

## What to click

1. **Recommend action** → expect donate 15 / discount 5 / urgency high  
2. **Find nearby recipients** → Community Food Center first  
3. **Create rescue** → item status becomes `confirmed rescue`  
4. **Complete rescue** → impact metrics update  
5. **Reset demo data** → start over  

Demo clock is fixed at 18:00 so the 20:00 cutoff always shows “2 hours remaining”.

WebMCP registration runs on load; without Chrome WebMCP support you’ll see a console skip warning — that’s fine.
