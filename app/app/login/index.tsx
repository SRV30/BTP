import { View, Text, TextInput, TouchableOpacity, StatusBar, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useAuth } from "../../store/auth-context";

export default function LoginScreen() {
  const router = useRouter();
  const { login, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onLogin = async () => {
    if (!email.includes("@") || password.length < 8) return Alert.alert("Validation", "Enter valid credentials");
    try { await login(email, password); router.replace("/dashboard"); } catch (e: any) { Alert.alert("Login failed", e.message); }
  };
  return <LinearGradient colors={["#020617", "#020B2D", "#020617"]} style={{flex:1,justifyContent:"center",padding:24}}><StatusBar barStyle="light-content"/>
    <Text style={{color:"white",fontSize:36,fontWeight:"700",marginBottom:20}}>Welcome Back</Text>
    <TextInput value={email} onChangeText={setEmail} placeholder="Email" placeholderTextColor="#9CA3AF" style={{color:'white',borderWidth:1,borderColor:'#334155',borderRadius:12,padding:14,marginBottom:12}}/>
    <TextInput value={password} onChangeText={setPassword} secureTextEntry placeholder="Password" placeholderTextColor="#9CA3AF" style={{color:'white',borderWidth:1,borderColor:'#334155',borderRadius:12,padding:14}}/>
    <TouchableOpacity onPress={()=>router.push('/forgot-password')}><Text style={{color:'#8B5CF6',marginTop:12}}>Forgot Password?</Text></TouchableOpacity>
    <TouchableOpacity onPress={onLogin} style={{marginTop:20,borderRadius:12,overflow:'hidden'}}><LinearGradient colors={["#9333EA", "#3B82F6"]} style={{padding:16,alignItems:'center'}}><Text style={{color:'white',fontWeight:'700'}}>{loading?"Signing in...":"Sign In"}</Text></LinearGradient></TouchableOpacity>
    <TouchableOpacity onPress={()=>router.push('/signup')}><Text style={{color:'#9CA3AF',marginTop:20}}>No account? <Text style={{color:'#8B5CF6'}}>Sign Up</Text></Text></TouchableOpacity>
  </LinearGradient>;
}
