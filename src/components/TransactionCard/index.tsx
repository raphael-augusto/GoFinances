import  React from 'react';
import { categories } from '../../utils/categories';

import * as S from './styles';



export interface PropsTransactionCard  {
  type: 'positive' | 'negative';
  name: string;
  amount: string;
  category: string;
  date: string;
}

interface Props{
  data: PropsTransactionCard
}

export function TransactionCard({ data } : Props){
  const [ category ] = categories.filter(
    item => item.key === data.category
  );

  return(
    <S.Container>
      <S.Title>{data.name}</S.Title>
      <S.Ammount type={data.type}>
        {data.type === 'negative' && '- '} 
        {data.amount}
      </S.Ammount>

      <S.Footer>
        <S.Category>
          <S.Icon name={category.icon}/>
          <S.CategoryName>{category.name}</S.CategoryName>
        </S.Category>

        <S.Date>{data.date}</S.Date>
      </S.Footer>
    </S.Container>
  );
}