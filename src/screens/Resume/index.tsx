import React ,{ useCallback, useEffect, useState }from 'react';
import { ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VictoryPie } from 'victory-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useFocusEffect } from '@react-navigation/native';
import { addMonths, subMonths, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useTheme } from 'styled-components';

import { useAuth } from '../../hook/auth';
import { HistoryCard } from '../../components/HistoryCard';
import { categories } from '../../utils/categories';

import * as S from './styles';



export interface TransactionProps {
  type: 'positive' | 'negative';
  name: string;
  amount: string;
  category: string;
  date: string;
}

export interface CategoryData{
  key: string;
  name: string;
  totalFormatted: string;
  total:number
  color: string;
  expensivesPercent: string;
}

export function Resume(){
  const [isLoading, setIsLoading] = useState(false);
  const [selectDate, setSelectDate] = useState(new Date());
  const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([]);
  const { user } = useAuth();

  const theme = useTheme();

  function handleChangeDate(action: 'next' | 'prev') {
    if(action === 'next'){
      setSelectDate(addMonths(selectDate, 1));

    }else{
      setSelectDate(subMonths(selectDate, 1));

    }
  }

  async function loadData() {
    setIsLoading(true);
    
    const dataKey = `@gofinances:transactions_user:${user.id}`;;
    const response = await AsyncStorage.getItem(dataKey);
    const responseFormated = response ? JSON.parse(response) : [];

    const expensives = responseFormated
    .filter((expensive: TransactionProps) => expensive.type === 'negative' 
      && new Date(expensive.date).getMonth() === selectDate.getMonth()
      && new Date(expensive.date).getFullYear() === selectDate.getFullYear()
    );

    //total expensives 
    const expensivesTotal = expensives.reduce((acumullator: number, expensive: TransactionProps) => {
      return acumullator + Number(expensive.amount);
    }, 0 );

    const totalByCategory:CategoryData[] = [];

    categories.forEach(category => {
      let categorySum = 0;

      expensives.forEach((expensive: TransactionProps) => {
        if(expensive.category === category.key){
          categorySum += Number(expensive.amount);
        }
      });

      if(categorySum > 0 ){
        const totalFormatted = categorySum.toLocaleString('pt-BR',{
          style: 'currency',
          currency: 'BRL'
        })

        const percent = `${(categorySum / expensivesTotal * 100).toFixed(0)}%`;

        totalByCategory.push({
        key: category.key,
        name: category.name,
        color: category.color,
        total:categorySum,
        totalFormatted,
        expensivesPercent: percent
        });
      }
    });

    setTotalByCategories(totalByCategory);
    setIsLoading(false);

    // console.log(totalByCategory);
  }

  //render the page again
  useFocusEffect(useCallback(() => {
    loadData();
  },[selectDate]));
  
  return(
    <S.Container>
      <S.Header>
        <S.Title>Resumo por categoria</S.Title>
      </S.Header>

      { 
        isLoading ? 
          <S.LoadContainer>
            <ActivityIndicator  
              color={theme.colors.primary}
              size="large"
            />
          </S.LoadContainer>  :
        
          <S.Content 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 24,
              paddingBottom: useBottomTabBarHeight()
            }}
          >
            <S.MonthSelect>
              <S.MonthSelectButton onPress={() => handleChangeDate('prev')}>
                <S.MonthSelectIcon name="chevron-left"/>
              </S.MonthSelectButton>

              <S.Month>{format(selectDate,'MMMM, yyyy', {locale: ptBR})}</S.Month>

              <S.MonthSelectButton  onPress={() => handleChangeDate('next')}>
                <S.MonthSelectIcon name="chevron-right"/>
              </S.MonthSelectButton>
            </S.MonthSelect>

            <S.ChartContainer>
              <VictoryPie
                data={totalByCategories}
                colorScale={totalByCategories.map(category => category.color)}
                style={{
                  labels: { 
                    fontSize: RFValue(18),
                    fontWeight: theme.fonts.bold,
                    fill: theme.colors.shape
                  }
                }}
                labelRadius={70}
                x="expensivesPercent"
                y="total"
              />
            </S.ChartContainer>

            {totalByCategories.map((item) =>(
                <HistoryCard  
                  key={item.key}
                  title={item.name}
                  amount={item.totalFormatted}
                  color={item.color}
                />
              ))
            }
          </S.Content>
      }
    </S.Container>
  );
}