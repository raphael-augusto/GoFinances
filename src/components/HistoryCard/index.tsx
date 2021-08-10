import React from 'react';

import * as S from './styles';

interface HistoryProps{
  title:string;
  amount:string;
  color:string;
}

export function HistoryCard({title,amount,color}:HistoryProps){
  return(
    <S.Container color={color} >
      <S.Title>{title}</S.Title>
      <S.Amount>{amount}</S.Amount>
    </S.Container>
  );
}