# People Analytics Model Showcase

An interactive React website presenting ten people-analytics model families, each with a live simulation using synthetic data.

## Running locally

```bash
npm install
npm run dev
```

Open http://localhost:5173.

## Building for production

```bash
npm run build
```

Permissions are funny.

---

## Executive Summary

People analytics has evolved well beyond retrospective HR reporting. Leading organizations now use analytical models to inform decisions about hiring, retention, pay, development, internal mobility, and workforce planning. Properly designed, these models can improve decision quality, allocate resources more effectively, and help HR function as a strategic business partner.

At the same time, analytical sophistication should not be confused with organizational readiness or decision quality. In high-stakes people decisions, the central questions are not merely whether a model can predict an outcome, but whether the target is valid, whether the process is fair, whether the result is explainable, and whether the model supports a lawful and defensible employment decision.

---

## The Ten Model Families

### 1. Employee Attrition Risk Modeling

Attrition modeling estimates the likelihood that an employee will leave within a defined period and identifies factors associated with elevated risk. Common methods include logistic regression, tree-based models, and survival/hazard models. Typical inputs: tenure, compensation vs. market, promotion history, manager changes, engagement scores.

**Caution.** Predicting exit is not the same as identifying an effective intervention. Voluntary and involuntary exits should be modeled separately. Risk scores must be linked to concrete retention actions.

### 2. Candidate-to-Role Matching and Semantic Ranking

NLP-driven matching models identify semantic similarity between candidate experience and role expectations — going beyond keyword matching. Methods include embeddings-based retrieval, skills extraction, and learning-to-rank. Inputs: resumes, job descriptions, certifications, assessment responses.

**Caution.** The target should be narrow job-relevant qualification alignment, not broad "fit." Social profile data introduces fairness and defensibility risks. These models prioritize human review, not autonomous decisions.

### 3. Performance Calibration and Bias Diagnostics

These models detect rating inflation, compression, drift, or systematic differences across managers and units. Methods include manager-effects models, hierarchical regression, and inter-rater reliability analysis.

**Caution.** The purpose is to surface patterns for structured calibration review, not to algorithmically overwrite managerial judgment. Ratings are socially produced and context-dependent.

### 4. Internal Mobility and Career Path Recommendation

Recommender systems, collaborative filtering, skills adjacency modeling, and knowledge graphs surface roles and development opportunities aligned with employee capabilities and organizational needs.

**Caution.** Historical mobility patterns may reflect uneven access to sponsorship or development. Recommendations must be explainable — not only what role fits, but what skills would improve readiness.

### 5. Pay Equity Analysis

Multivariate regression and decomposition methods identify whether compensation differences remain after controlling for legitimate business factors such as level, experience, performance, and geography.

**Caution.** Model specification quality determines result quality. These analyses surface disparities for review and remediation — they do not establish legal intent or liability.

### 6. Learning Effectiveness and Training Impact Evaluation

Randomized experiments, matched comparison groups, and difference-in-differences designs estimate whether a training intervention caused measurable improvement in knowledge, behavior, or business performance.

**Caution.** A well-liked program may not improve capability. A program correlated with promotion may simply attract high performers. The goal is to isolate training effect from selection bias.

### 7. Recruiting Source and Channel Effectiveness Modeling

Funnel analysis, conversion modeling, and multi-touch attribution frameworks assess how candidates move from application through retention — enabling smarter budget allocation across channels.

**Caution.** The fastest channel is not always the best. Source analytics requires a clear definition of value that includes downstream outcomes such as retention and early performance.

### 8. Skills Inference and Future Skills Gap Forecasting

Skills taxonomy mapping, scenario analysis, and demand forecasting compare projected skill demand against current and expected internal supply — enabling proactive reskilling or recruiting before gaps become acute.

**Caution.** Forecasts should be presented as scenarios with uncertainty ranges, not precise predictions. Business demand and labor market conditions are subject to change.

### 9. Employee Referral and Talent Network Modeling

Propensity models, organizational network analysis, and graph-based methods identify referral patterns associated with strong, durable hires and monitor for diversity risk from network homophily.

**Caution.** Networks cluster by background and demographic profile. Referral optimization can reinforce homophily if left unmonitored. Simpler analyses are easier to govern than complex graph architectures.

### 10. High-Potential and Succession Analytics

Clustering, talent segmentation, and supervised models identify patterns associated with leadership readiness, growth capacity, or accelerated progression — broadening the talent discussion beyond manager advocacy.

**Caution.** Potential is conceptually distinct from performance, and both are often measured imperfectly. Analytics should function as one input into structured human review, not an automated label.

---

## Cross-Cutting Principles

| Principle | Summary |
|---|---|
| Decision Relevance | Link every model to a clear use case, decision owner, and measurable success criterion |
| Measurement Quality | Weak underlying measures produce statistically polished but misleading outputs |
| Prediction vs. Intervention | Correlation is not causation; prescriptive claims require causal evidence |
| Fairness & Legal Defensibility | Build fairness testing into the model lifecycle, not as an afterthought |
| Explainability & Trust | Opaque models create practical and legal problems even when predictive performance is strong |
| Model Maintenance | Monitor for drift, recalibrate periodically, retire when obsolete |
| Governance | Clear data ownership, fairness monitoring, human review in high-stakes decisions |

---

## Conclusion

The most effective organizations are not those that deploy the most advanced techniques. They apply analytics to clearly defined workforce decisions, use valid and job-relevant measures, monitor fairness and drift, and preserve informed human oversight in high-stakes contexts. People analytics is best understood as a disciplined decision-support capability — not an engine for automating HR judgment.
