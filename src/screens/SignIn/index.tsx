import React, { useState }  from 'react';
import {ActivityIndicator, Alert, Platform} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components';

import { useAuth } from '../../hook/auth';
import { SignInSocialButton } from '../../components/SignInSocialButton';
import AppleSvg from '../../assets/apple.svg';
import GoogleSvg from '../../assets/google.svg';
import LogoSvg from '../../assets/logo.svg';


import * as S from './styles';


export function SignIn(){
  const [isLoading, setIsLoading ] = useState(false);
  const { signInWithGoogle ,signInWithApple} = useAuth();
  
  const theme = useTheme();

  async function handleSignInWithGoogle() {
    try {
      setIsLoading(true);
      return await signInWithGoogle();

    } catch (error) {
      Alert.alert('Não foi possível conectar a conta da Google');
      setIsLoading(false);

      console.log(error);
    }
  }

  async function handleSignInWithApple() {
    try {
      setIsLoading(true);
      return await signInWithApple();

    } catch (error) {
      Alert.alert('Não foi possível conectar a conta da Apple');
      setIsLoading(false);

      console.log(error);
    }
  }
  
  return(
    <S.Container>
      <S.Header>
        <S.TitleWrapper>
          <LogoSvg 
            width={RFValue(120)}
            height={RFValue(68)}
          />

          <S.Title>
            Controle suas {'\n'}
            finanças de forma{'\n'}
            muito simples{'\n'}
          </S.Title>
        </S.TitleWrapper>

        <S.SignInTitle>
          Faça seu login com {'\n'}
          uma das contas abaixo
        </S.SignInTitle>
      </S.Header>

      <S.Footer>
        <S.FooterWrapper>
          <SignInSocialButton 
            title="Entra com Google"
            svg={GoogleSvg}
            onPress={handleSignInWithGoogle}
          /> 
          
          {
            Platform.OS === 'ios' &&
            <SignInSocialButton 
              title="Entra com Apple"
              svg={AppleSvg}
              onPress={handleSignInWithApple}
            /> 
          }
        </S.FooterWrapper>

        { isLoading && 
          <ActivityIndicator 
            color={theme.colors.shape}  
            style={{marginTop: 18 }}
          />
        }
      </S.Footer>
    </S.Container>
  );
}