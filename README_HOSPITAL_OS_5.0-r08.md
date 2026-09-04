# VCT Hospital OS 5.0-r08

专业宠物医院版：把现有 Vet Clinical Toolbox 的 Clinical OS 与医院经营/流程基础设施合并为一个 Local-first PWA。

## 六阶段
1. 医院基础设施：客户/宠物 CRM、预约、排队、前台工作台、病例归档/复诊、就诊生命周期。
2. 医疗闭环：EMR/POMR、Patient State、Clinical OS、AI Clinical Copilot、检查/处方入口、医生/护士任务、审计。
3. 经营：收费、会员、库存、药房、采购、经营 KPI。
4. 住院/手术：住院、ICU 状态、护理、手术、麻醉、围术期记录、出院状态。
5. 宠主端：授权后的预约、就诊状态、报告摘要、医嘱、处方、复诊提醒。
6. AI 医院大脑：AI Doctor、AI Nurse、AI Manager、AI Marketing、医院级上下文与管理指标。

## 数据边界
Organization/Hospital → Staff/Role → Client → Pet → Visit → Encounter → Problem → Observation/Lab → Order → Prescription → Procedure/Surgery → Hospitalization → Invoice/Payment → Inventory Movement → Follow-up → Timeline/Audit

Patient State 只代表“当前正在处理的患者临床状态”，不是企业数据库；医院业务数据使用独立、版本化结构。

## 临床安全
- 不自动执行 AI 建议。
- AI 药物信息只能作为 Candidate，不能自动写入正式药库。
- 剂量/途径/疗程必须核对当前制剂标签、指南或院内审核资料。
- 证据分层 A/B/C/D；Known Facts / Clinical Inference / Differential / Recommendation / Doctor Confirmed / Executed 分层。
- 急诊优先 ABCDE；液体治疗动态监测；抗菌药遵循 stewardship；疼痛尽量使用物种适配量表。

## 数据安全
本版本默认本机存储，支持 JSON 备份/恢复。电子签名/审计接口已经预留；生产环境接入服务器时，应增加真正的身份认证、RBAC、密钥管理、传输加密和后端审计。
