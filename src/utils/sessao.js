export function getUsuarioSessao() {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getPerfil() {
  const user = getUsuarioSessao();
  const perfil = user?.perfil || user?.role || '';
  return String(perfil).trim().toUpperCase();
}

export function isDentista() {
  return getPerfil() === 'DENTISTA';
}

export function getDentistaLogado() {
  const user = getUsuarioSessao();
  if (!user) return null;

  const base = user.usuario ?? user;
  const perfil = String(
    user.perfil ?? user.role ?? base.perfil ?? base.role ?? '',
  ).trim().toUpperCase();
  const fkPerfil = Number(user.fkPerfil ?? base.fkPerfil);

  if (perfil !== 'DENTISTA' && fkPerfil !== 2) return null;

  const id =
    base.idUsuario ??
    base.id ??
    user.idUsuario ??
    user.id ??
    user.userId ??
    base.userId ??
    null;

  return {
    id,
    nome: base.nome ?? user.nome ?? '',
    cro: base.cro ?? user.cro ?? '',
    email: base.email ?? user.email ?? '',
    telefone: base.telefone ?? user.telefone ?? '',
    especialidade: base.especialidade ?? 'Clínica Geral',
    ativo: base.ativo ?? user.ativo ?? true,
  };
}

export function podeCriarAgendamento() {
  const perfil = getPerfil();
  if (!perfil) return true;
  return perfil === 'ADMIN' || perfil === 'RECEPCIONISTA';
}
