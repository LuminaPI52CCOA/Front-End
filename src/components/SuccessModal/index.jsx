import { useEffect, useRef } from 'react';
import * as S from './styles';

export function SuccessModal({ titulo, subtitulo }) {
  const tituloRef = useRef(null);

  useEffect(() => {
    tituloRef.current?.focus();
  }, []);

  return (
    <S.Overlay>
      <S.SuccessBox role="status">
        <S.AnimatedCheck viewBox="0 0 100 100" aria-hidden="true">
          <circle cx="50" cy="50" r="45" />
          <path d="M30 50 L45 65 L70 35" />
        </S.AnimatedCheck>
        <S.SuccessTitle ref={tituloRef} tabIndex={-1}>
          {titulo}
        </S.SuccessTitle>
        <S.SuccessSubtitle>{subtitulo}</S.SuccessSubtitle>
      </S.SuccessBox>
    </S.Overlay>
  );
}

export default SuccessModal;
