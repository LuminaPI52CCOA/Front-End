import { DENTISTAS, ESPECIALIDADES, PACIENTES } from '../../../data/agenda';
import * as S from './styles';

function IconeNovaPessoa() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" />
      <line x1="19" y1="7" x2="19" y2="13" />
      <line x1="16" y1="10" x2="22" y2="10" />
    </svg>
  );
}

export function FormularioAgendamento({ valores, onChange }) {
  const alterar = (campo) => (evento) => onChange(campo, evento.target.value);

  return (
    <S.Card aria-label="Formulário do agendamento">
      <S.Campo>
        <label htmlFor="select-paciente">Pacientes:</label>
        <S.LinhaPaciente>
          <S.EnvolvedorSeletor>
            <S.Seletor
              id="select-paciente"
              value={valores.paciente}
              onChange={alterar('paciente')}
            >
              <option value="">Selecione</option>
              {PACIENTES.map((opcao) => (
                <option key={opcao.value} value={opcao.value}>
                  {opcao.label}
                </option>
              ))}
            </S.Seletor>
          </S.EnvolvedorSeletor>

          <S.BotaoNovoPaciente
            type="button"
            title="Cadastrar novo paciente (em breve)"
            aria-label="Cadastrar novo paciente"
          >
            <IconeNovaPessoa />
          </S.BotaoNovoPaciente>
        </S.LinhaPaciente>
      </S.Campo>

      <S.Campo>
        <label htmlFor="select-dentista">Dentistas:</label>
        <S.EnvolvedorSeletor>
          <S.Seletor
            id="select-dentista"
            value={valores.dentista}
            onChange={alterar('dentista')}
          >
            <option value="">Selecione</option>
            {DENTISTAS.map((opcao) => (
              <option key={opcao.value} value={opcao.value}>
                {opcao.label}
              </option>
            ))}
          </S.Seletor>
        </S.EnvolvedorSeletor>
      </S.Campo>

      <S.Campo>
        <label htmlFor="select-especialidade">Especialidades:</label>
        <S.EnvolvedorSeletor>
          <S.Seletor
            id="select-especialidade"
            value={valores.especialidade}
            onChange={alterar('especialidade')}
          >
            <option value="">Selecione</option>
            {ESPECIALIDADES.map((opcao) => (
              <option key={opcao.value} value={opcao.value}>
                {opcao.label}
              </option>
            ))}
          </S.Seletor>
        </S.EnvolvedorSeletor>
      </S.Campo>

      <S.Campo>
        <label htmlFor="area-observacoes">Observações:</label>
        <S.AreaObservacoes
          id="area-observacoes"
          placeholder="Notas Adicionais"
          value={valores.observacoes}
          onChange={alterar('observacoes')}
        />
      </S.Campo>
    </S.Card>
  );
}

export default FormularioAgendamento;
