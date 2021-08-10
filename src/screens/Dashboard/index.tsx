import React,{ useEffect, useState, useCallback}  from  'react';
import { useFocusEffect } from '@react-navigation/native';
import { ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from 'styled-components';

import { HighlightCard } from '../../components/HighlightCard';
import { TransactionCard, PropsTransactionCard } from '../../components/TransactionCard';
import { useAuth } from '../../hook/auth';

import * as S from './styles';


export interface DataListProps extends PropsTransactionCard{
  id: string;
};

interface HighlightCardProps {
  amount: string;
  lasTransaction: string;
}

interface HighlightCardData {
  entries: HighlightCardProps;
  expensive: HighlightCardProps;
  total: HighlightCardProps;
}

export function Dashboard(){
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<DataListProps[]>([]);
  const [highlightCardData , setHighlightCardData] = useState<HighlightCardData>({} as HighlightCardData);
  
  const theme = useTheme();
  const { signOut, user } = useAuth();

  //HIGHEST DATE
  function getLastTransaction(
    collection: DataListProps[], 
    type: 'positive' | 'negative'
  ){
    const collectionFilttered = collection
    .filter((transaction) => transaction.type=== 'positive');

    if(collectionFilttered.length === 0) return 0;

    const lastTransactionDate = Math.max.apply(Math, collectionFilttered
      .map((transaction) => new Date(transaction.date).getTime())
    );

    const lastTransaction = new Date(lastTransactionDate);
    
    return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString('pt-BR',{month: 'long'})}`
    // console.log(hightsDateTransaction);
  }

  async function loadTransaction() {
    const dataKey = `@gofinances:transactions_user:${user.id}`;
    const response = await AsyncStorage.getItem(dataKey);
    const transactions = response ? JSON.parse(response) : [];

    let entriesTotal = 0;
    let expensiveTotal = 0;

    const transactionFormatted: DataListProps[] = transactions.map(
      (item: DataListProps) =>{

        if(item.type === 'positive'){
          entriesTotal += Number(item.amount);
        } else {
          expensiveTotal += Number(item.amount);
        }

        const amount = Number(item.amount).toLocaleString('pt-BR',{
          style: 'currency',
          currency: 'BRL'
        });

        const date = Intl.DateTimeFormat('pt-br',{
          day: '2-digit',
          month: '2-digit',
          year: '2-digit'
        }).format(new Date(item.date));

        return{
          id: item.id,
          name: item.name,
          amount,
          type: item.type,
          category: item.category,
          date
        }
      }
    );

    setTransactions(transactionFormatted);

    const lastTransactionEntries = getLastTransaction(transactions, 'positive');
    const lastTransactionExpensive = getLastTransaction(transactions, 'negative');
    const totalInterval = lastTransactionEntries === 0
                          ? 'Não há transações.'
                          : `01 à ${lastTransactionExpensive}`

    //CALCULATE CARD
    const total = entriesTotal- expensiveTotal;

    setHighlightCardData({
      entries:{
        amount: entriesTotal.toLocaleString('pt-BR',{
          style: 'currency',
          currency: 'BRL'
        }),
        lasTransaction: lastTransactionEntries === 0 
        ? 'Não há transações.'
        : `Útima entrada dia ${lastTransactionEntries}`
      },
      expensive:{
        amount: expensiveTotal.toLocaleString('pt-BR',{
          style: 'currency',
          currency: 'BRL'
        }),
        lasTransaction: lastTransactionEntries === 0 
        ? 'Não há transações.'
        :`Útima saída dia ${lastTransactionExpensive}`
      },
      total:{
        amount: total.toLocaleString('pt-BR',{
          style: 'currency',
          currency: 'BRL'
        }),
        lasTransaction: totalInterval
      }
    })
    
    // console.log(transactionFormatted);
    setIsLoading(false);
  }
  
  useEffect(() => {
    loadTransaction();
    /** clean list */ 
    // const dataKey = `@gofinances:transactions_user:${user.id}`;
    // AsyncStorage.removeItem(dataKey);
  }, []);

  //render the page again
  useFocusEffect(useCallback(() => {
    loadTransaction();
  },[]));

  return(
    <S.Container >
      {
        isLoading ? 
        <S.LoadContainer>
          <ActivityIndicator  
            color={theme.colors.primary}
            size="large"
          />
        </S.LoadContainer>  :
        <>
          <S.Header>
            <S.UserWrapper>
              <S.UserInfo>
                <S.Photo 
                  source={{uri: user.photo}} 
                />

                <S.User>
                  <S.UserGreeting>Olá,</S.UserGreeting>
                  <S.UserName>{user.name}</S.UserName>
                </S.User>
              </S.UserInfo>

              <S.LogoutButton onPress={signOut}>
                <S.Icon name="power"/>
              </S.LogoutButton>
            </S.UserWrapper>
          </S.Header>

          <S.HighlightCards>
            <HighlightCard 
              type="up"
              tittle="Entradas"
              amount={highlightCardData.entries.amount} 
              lastTransation={highlightCardData.entries.lasTransaction}
            />
            <HighlightCard 
              type="down"
              tittle="Saídas" 
              amount={highlightCardData.expensive.amount} 
              lastTransation={highlightCardData.expensive.lasTransaction}
            />
            <HighlightCard 
              type="total"
              tittle="Total" 
              amount={highlightCardData.total.amount} 
              lastTransation={highlightCardData.total.lasTransaction}
            />
          </S.HighlightCards>

          <S.Transactions>
          <S.Title>Listagem</S.Title>
  
          <S.TransactionList 
            data={transactions}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <TransactionCard data={item} />}
          />

          </S.Transactions>
        </>
      }
    </S.Container>
  );
}

          