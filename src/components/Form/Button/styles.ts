import styled from "styled-components/native";
import { RectButton } from 'react-native-gesture-handler';
import { RFValue } from "react-native-responsive-fontsize";


export const Container = styled(RectButton)`
  width: 100%;
  align-items: center;
  padding: 18px;
  border-radius: 5px;
  
  background-color: ${({theme}) => theme.colors.secondary};
`;
export const Title = styled.Text`
  font-family: ${({theme}) => theme.fonts.medium};
  font-size: ${RFValue(14)}px;
  
  color: ${({theme}) => theme.colors.shape};
`;