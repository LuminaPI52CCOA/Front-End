# pip install selenium webdriver-manager

from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.common.by import By
import traceback
import time
import os

# Configuração do Web Driver (Google Chrome)
servico = Service(ChromeDriverManager().install())

opcoes_adicionais = ChromeOptions()
# Descomente a linha abaixo caso queira rodar sem abrir a janela do navegador (Headless):
# opcoes_adicionais.add_argument('--headless=new')

driver = webdriver.Chrome(service=servico, options=opcoes_adicionais)

# Configuração da janela do navegador
driver.set_window_size(1280, 900)

# URL base do projeto (porta padrão do Vite: 5173)
url_base = "http://localhost:5173"

# Configuração da espera explícita de até 5 segundos
espera = WebDriverWait(driver, 5)

# Garante que a pasta de prints de erro exista
os.makedirs("./telas_erros", exist_ok=True)

try:
    print("Iniciando testes da página de Cadastro...")

    # 1. Navegar até a página de Cadastro
    driver.get(f"{url_base}/cadastro")

    # 2. Verificação de carregamento da página
    # Verifica se o título "Cadastro" está visível no cabeçalho do card
    titulo_cadastro = espera.until(
        EC.visibility_of_element_located((By.XPATH, "//h1[contains(text(), 'Cadastro')]"))
    )
    assert "Cadastro" in titulo_cadastro.text, "O título 'Cadastro' não foi encontrado na página."

    # 3. Localizar os campos do formulário
    input_nome = driver.find_element(By.NAME, "nome")
    input_cpf = driver.find_element(By.NAME, "cpf")
    input_email = driver.find_element(By.NAME, "email")
    input_senha = driver.find_element(By.NAME, "senha")
    input_cro = driver.find_element(By.NAME, "cro")
    select_cargo = driver.find_element(By.NAME, "cargo")
    botao_cadastrar = driver.find_element(By.XPATH, "//button[contains(., 'Cadastrar')]")
    link_login = driver.find_element(By.LINK_TEXT, "Fazer Login")

    # Verifica se todos os campos estão visíveis e habilitados
    assert input_nome.is_displayed() and input_nome.is_enabled(), "Campo 'Nome' não está acessível."
    assert input_cpf.is_displayed() and input_cpf.is_enabled(), "Campo 'CPF' não está acessível."
    assert input_email.is_displayed() and input_email.is_enabled(), "Campo 'Email' não está acessível."
    assert input_senha.is_displayed() and input_senha.is_enabled(), "Campo 'Senha' não está acessível."
    assert input_cro.is_displayed() and input_cro.is_enabled(), "Campo 'CRO' não está acessível."
    assert select_cargo.is_displayed() and select_cargo.is_enabled(), "Campo 'Cargo' não está acessível."
    assert botao_cadastrar.is_displayed() and botao_cadastrar.is_enabled(), "Botão 'Cadastrar' não está acessível."
    assert link_login.is_displayed(), "Link 'Fazer Login' não está visível."

    # 4. Teste de validação: tentar submeter formulário em branco
    botao_cadastrar.click()

    # Espera que os alertas de campos obrigatórios sejam exibidos
    alerta_nome = espera.until(
        EC.visibility_of_element_located((By.XPATH, "//*[contains(text(), 'O nome é obrigatório')]"))
    )
    assert alerta_nome.is_displayed(), "Validação de nome obrigatório não apareceu."

    corpo_pagina = driver.find_element(By.TAG_NAME, "body").text
    assert "O CPF é obrigatório" in corpo_pagina, "Validação de CPF obrigatório não apareceu."
    assert "O e-mail é obrigatório" in corpo_pagina, "Validação de e-mail obrigatório não apareceu."
    assert "A senha é obrigatória" in corpo_pagina, "Validação de senha obrigatória não apareceu."
    assert "O CRO é obrigatório" in corpo_pagina, "Validação de CRO obrigatório não apareceu."

    # 5. Teste de preenchimento dos campos de texto
    input_nome.send_keys("Dra. Beatriz Santos")
    assert input_nome.get_attribute("value") == "Dra. Beatriz Santos", "Valor do campo 'Nome' incorreto."

    input_email.send_keys("beatriz.santos@lumina.com")
    assert input_email.get_attribute("value") == "beatriz.santos@lumina.com", "Valor do campo 'Email' incorreto."

    input_senha.send_keys("senha@123")
    assert input_senha.get_attribute("value") == "senha@123", "Valor do campo 'Senha' incorreto."

    input_cro.send_keys("SP-CD-12345")
    assert input_cro.get_attribute("value") == "SP-CD-12345", "Valor do campo 'CRO' incorreto."

    # 6. Teste da máscara de CPF (ao digitar apenas dígitos, deve formatar automaticamente)
    input_cpf.send_keys("12345678901")
    cpf_formatado = input_cpf.get_attribute("value")
    assert cpf_formatado == "123.456.789-01", (
        f"Máscara do CPF incorreta. Esperado '123.456.789-01', obtido '{cpf_formatado}'"
    )

    # 7. Teste de seleção no elemento Select (Cargo)
    cargo_select = Select(select_cargo)
    cargo_select.select_by_visible_text("Dentista")
    opcao_selecionada = cargo_select.first_selected_option.text
    assert opcao_selecionada == "Dentista", (
        f"Opção selecionada no Select incorreta. Esperado 'Dentista', obtido '{opcao_selecionada}'"
    )

    # 8. Teste de navegação: clicar no link para fazer login
    link_login.click()

    # Aguarda a URL mudar para '/login'
    espera.until(EC.url_contains("/login"))
    assert "/login" in driver.current_url, (
        "A navegação para a página de login falhou. URL atual: " + driver.current_url
    )

    print("\r\n ✅ Testes da página de Cadastro passaram com sucesso! 💯 \r\n")

except Exception as e:
    print(f"\r\n ❌ Ocorreu um erro no teste da página de Cadastro: {e}")

    if isinstance(e, TimeoutException):
        traceback.print_exc()

    # Salva captura de tela em caso de falha
    driver.save_screenshot("./telas_erros/teste_cadastro.png")
    print("📸 Captura de tela do erro salva em ./telas_erros/teste_cadastro.png")

finally:
    # Fecha o navegador e encerra a sessão
    driver.quit()
