import { Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { useAuth } from "../../store/auth-context";

export default function ForgotPasswordScreen(){
  const { forgotPassword } = useAuth(); const [email,setEmail]=useState('');
  const submit=async()=>{try{await forgotPassword(email);Alert.alert('Done','If that email exists, reset token sent.');}catch(e:any){Alert.alert('Error',e.message)}};
  return <LinearGradient colors={["#020617", "#020B2D", "#020617"]} style={{flex:1,justifyContent:'center',padding:24}}>
    <Text style={{color:'white',fontSize:32,fontWeight:'700'}}>Forgot Password</Text>
    <TextInput value={email} onChangeText={setEmail} placeholder='Email' placeholderTextColor='#9CA3AF' style={{color:'white',borderWidth:1,borderColor:'#334155',borderRadius:12,padding:14,marginTop:20}}/>
    <TouchableOpacity onPress={submit} style={{marginTop:20,borderRadius:12,overflow:'hidden'}}><LinearGradient colors={["#9333EA", "#3B82F6"]} style={{padding:16,alignItems:'center'}}><Text style={{color:'white',fontWeight:'700'}}>Send Reset</Text></LinearGradient></TouchableOpacity>
  </LinearGradient>
}
