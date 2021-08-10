import React from 'react';
import { RectButtonProps } from 'react-native-gesture-handler';

import * as S from './styles';

const icons = {
  up: 'arrow-up-circle',
  down: 'arrow-down-circle'
}

interface PropsButton extends RectButtonProps{
  title: string;
  type: 'up' | 'down';
  isActive: boolean;
}

export function TransactionTypeButton({title,type,isActive,...rest}: PropsButton) {
  return(
    <S.Container 
      isActive={isActive} 
      type={type} 
      
    > 
      <S.Button {...rest}>
        <S.Icon 
          name={icons[type]}
          type={type}
        />
        <S.Title>{title}</S.Title>
      </S.Button>
    </S.Container>
  );
}

