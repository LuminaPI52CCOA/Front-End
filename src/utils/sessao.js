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

export function podeCriarAgendamento() {
  const perfil = getPerfil();
  if (!perfil) return true;
  return perfil === 'ADMIN' || perfil === 'RECEPCIONISTA';
}
