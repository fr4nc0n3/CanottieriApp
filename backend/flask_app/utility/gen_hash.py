from werkzeug.security import generate_password_hash

print("Generazione hash string con modulo werkzeug.security\n" + \
    "usando la funzione 'generate_password_hash'")

string = input("Inserisci stringa da hashare: ")
hashed = generate_password_hash(string)

print(hashed)