import React from 'react';

import * as S from './styles';

interface Props {
  type: 'up' | 'down' | 'total';
  tittle: string;
  amount: string;
  lastTransation: string;
}

const icon = {
  up: 'arrow-up-circle',
  down: 'arrow-down-circle',
  total: 'dollar-sign'
}

export function HighlightCard({ 
  type,
  tittle,
  amount,
  lastTransation
} : Props){
  return(
    <S.Container type={type} >
      <S.Header>
        <S.Title type={type}>
          {tittle}
        </S.Title>
        <S.Icon name={icon[type]} type={type} />
      </S.Header>

      <S.Footer>
        <S.Ammount type={type}>
          {amount}
        </S.Ammount>
        <S.LastTransaction type={type} >
          {lastTransation}
        </S.LastTransaction>
      </S.Footer>
    </S.Container>
  );
}