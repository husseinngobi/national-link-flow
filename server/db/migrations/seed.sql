-- Seed demo citizen and requests for Postgres
BEGIN;

INSERT INTO citizens (nin, name, dob, sex, district, parish, village, tribe, religion, marital_status, mother, father, spouse, dependants, phone, email, photo_initial, risk_score, face_match_confidence, records_json, vehicles_json, properties_json, tax_history_json, criminal_json, education_json, employment_json, health_json, telecom_json, travel_json, updated_at)
VALUES ('CM900112ABCDE', 'Nakato Aisha Mirembe', '1990-01-12', 'Female', 'Kampala Central', 'Nakasero II', 'Plot 18, Kira Road', 'Muganda', 'Muslim', 'Married', 'Namusoke Joy Mirembe', 'Ssebunya Edward Mirembe', 'Kato David Lubega · CM880711XYZ12', 2, '+256 772 458 119', 'a.nakato@mirembe.ug', 'NA', 12, 98.7, '{}', '[]', '[]', '[]', '[]', '[]', '[]', '[]', '[]', now()::text)
ON CONFLICT (nin) DO NOTHING;

INSERT INTO requests (id, nin, service, status, date_label, notes, created_at)
VALUES
('REQ-2026-0001', 'CM900112ABCDE', 'Driving permit renewal', 'Verified', '12 May 2026', 'Processed by transport desk', '2026-05-12T08:15:00.000Z'),
('REQ-2026-0002', 'CM900112ABCDE', 'Land title verification', 'In review', '15 May 2026', 'Awaiting lands registrar confirmation', '2026-05-15T09:10:00.000Z'),
('REQ-2026-0003', 'CM900112ABCDE', 'Tax clearance certificate', 'Verified', '18 May 2026', 'URA clearance issued', '2026-05-18T11:22:00.000Z'),
('REQ-2026-0004', 'CM900112ABCDE', 'Passport renewal', 'Pending payment', '19 May 2026', 'Citizen action required', '2026-05-19T13:05:00.000Z')
ON CONFLICT (id) DO NOTHING;

INSERT INTO citizen_accounts (nin, pin, label, created_at)
VALUES ('CM900112ABCDE', '771194', 'Demo citizen portal account', now()::text)
ON CONFLICT (nin) DO NOTHING;

COMMIT;
