import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useAuth } from "../../store/auth-context";

export default function SignupScreen(){
  const router = useRouter(); const { signup } = useAuth();
  const [email,setEmail]=useState(''); const [password,setPassword]=useState('');
  const onSignup = async()=>{ if(!email.includes('@')||password.length<8) return Alert.alert('Validation','Email/password invalid'); try{await signup(email,password);router.replace('/dashboard');}catch(e:any){Alert.alert('Signup failed',e.message);} };
  return <LinearGradient colors={["#020617", "#020B2D", "#020617"]} style={{flex:1,justifyContent:'center',padding:24}}><Text style={{color:'white',fontSize:34,fontWeight:'700'}}>Create Account</Text>
  <TextInput value={email} onChangeText={setEmail} placeholder='Email' placeholderTextColor='#9CA3AF' style={{color:'white',borderWidth:1,borderColor:'#334155',borderRadius:12,padding:14,marginTop:20}}/>
  <TextInput value={password} onChangeText={setPassword} placeholder='Password' secureTextEntry placeholderTextColor='#9CA3AF' style={{color:'white',borderWidth:1,borderColor:'#334155',borderRadius:12,padding:14,marginTop:12}}/>
  <TouchableOpacity onPress={onSignup} style={{marginTop:20,borderRadius:12,overflow:'hidden'}}><LinearGradient colors={["#9333EA", "#3B82F6"]} style={{padding:16,alignItems:'center'}}><Text style={{color:'white',fontWeight:'700'}}>Create Account</Text></LinearGradient></TouchableOpacity>
  <TouchableOpacity onPress={()=>router.back()}><Text style={{color:'#8B5CF6',marginTop:16}}>Back to Login</Text></TouchableOpacity>
  </LinearGradient>
}
