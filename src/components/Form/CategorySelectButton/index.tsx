import React from 'react';

import * as S from './styles';

interface CategoryProps{
  title: string;
  onPress?: () => void;
}

export function CategorySelectButton({title, onPress}: CategoryProps){
  return(
    <S.Container onPress={onPress}>
      <S.Category>{title}</S.Category>
      <S.Icon name="chevron-down"/>
    </S.Container>
  );
}