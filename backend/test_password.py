from app.auth.passsword import hash_password, verify_password

password = "admin123"

hashed = hash_password(password)

print("Original :", password)
print("Hashed   :", hashed)

print("Verify :", verify_password("admin123", hashed))
print("Wrong  :", verify_password("hello", hashed))