INSERT INTO facilities (id, name, location_label) VALUES
  (1, 'BankFix Demo Branch North', 'Fictional Region North'),
  (2, 'BankFix Demo Branch Central', 'Fictional Region Central')
ON CONFLICT (id) DO NOTHING;

INSERT INTO assets (id, facility_id, name, asset_type) VALUES
  (1, 1, 'Demo Air Conditioner A', 'HVAC'),
  (2, 1, 'Demo Generator A', 'Power'),
  (3, 2, 'Demo Lift A', 'Lift')
ON CONFLICT (id) DO NOTHING;

INSERT INTO maintenance_requests
  (id, facility_id, asset_id, title, description, priority, status, reported_by)
VALUES
  (1, 1, 1, 'Air conditioner not cooling', 'Fictional demo issue for API testing.', 'high', 'open', 'Demo Operations User'),
  (2, 1, 2, 'Generator inspection required', 'Fictional scheduled maintenance example.', 'medium', 'in_progress', 'Demo Branch Supervisor'),
  (3, 2, 3, 'Lift making unusual noise', 'Fictional demo issue; no real site details.', 'urgent', 'open', 'Demo Operations User')
ON CONFLICT (id) DO NOTHING;

SELECT setval(pg_get_serial_sequence('facilities','id'), GREATEST((SELECT COALESCE(MAX(id),1) FROM facilities),1));
SELECT setval(pg_get_serial_sequence('assets','id'), GREATEST((SELECT COALESCE(MAX(id),1) FROM assets),1));
SELECT setval(pg_get_serial_sequence('maintenance_requests','id'), GREATEST((SELECT COALESCE(MAX(id),1) FROM maintenance_requests),1));
