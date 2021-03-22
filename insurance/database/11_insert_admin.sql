INSERT INTO user ( 
username, password, first_name, last_name,
user_status, user_type ) VALUES ( 
'admin', '$2b$10$FhLcRpZZjbGVM6FRjAApN.OT.prNUtfq5D8Rl9p9qVPU3zzGyLMym', 'first', 'last', '1', '1'
);

# password is password

INSERT INTO security_answer ( 
question_id, user_id, answer
) VALUES ( 
1,1,'answer'
);

INSERT INTO security_answer ( 
question_id, user_id, answer
) VALUES ( 
2,1,'answer'
);

INSERT INTO security_answer ( 
question_id, user_id, answer
) VALUES ( 
3,1,'answer'
);