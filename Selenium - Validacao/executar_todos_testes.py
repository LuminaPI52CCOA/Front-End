import subprocess
import sys

def rodar_teste(arquivo):
    print("=" * 60)
    print(f"Executando {arquivo}...")
    print("=" * 60)
    resultado = subprocess.run([sys.executable, arquivo])
    return resultado.returncode == 0

if __name__ == "__main__":
    testes = ["Selenium - Validacao/teste_login.py", "Selenium - Validacao/teste_cadastro.py"]
    sucessos = 0

    for teste in testes:
        if rodar_teste(teste):
            sucessos += 1
        print("\n")

    print("=" * 60)
    print(f"Resultado final: {sucessos}/{len(testes)} suites de teste passaram!")
    print("=" * 60)
