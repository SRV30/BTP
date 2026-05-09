import { useEffect, useState } from "react";
import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useAuth } from "../../store/auth-context";
import { api } from "../../services/api";

export default function Dashboard(){
  const { token, userEmail, logout } = useAuth(); const router = useRouter();
  const [data, setData] = useState<any>(null);
  useEffect(()=>{ if(!token){router.replace('/login'); return;} api.dashboard(token).then(setData).catch(()=>{}); },[token]);
  if(!token) return null;
  return <LinearGradient colors={["#020617", "#020B2D", "#020617"]} style={{flex:1}}><ScrollView contentContainerStyle={{padding:16,gap:12}}>
    <Text style={{color:'white',fontSize:20}}>Hello, {userEmail || 'User'}</Text>
    <View style={{backgroundColor:'rgba(15,23,42,0.8)',borderWidth:1,borderColor:'rgba(255,255,255,0.08)',borderRadius:16,padding:16}}><Text style={{color:'white'}}>Today's Mood</Text><Text style={{color:'#22D3EE',fontSize:42,fontWeight:'700'}}>{data?.today?.mood_score ?? '--'}</Text><Text style={{color:'#A78BFA'}}>{data?.today?.mood || 'Loading...'}</Text></View>
    <View style={{flexDirection:'row',flexWrap:'wrap',gap:10}}>{['stress_level','sleep_hours','steps','screen_time'].map((k)=><View key={k} style={{width:'48%',backgroundColor:'rgba(15,23,42,0.8)',borderRadius:14,padding:12,borderWidth:1,borderColor:'rgba(255,255,255,0.06)'}}><Text style={{color:'#9CA3AF'}}>{k}</Text><Text style={{color:'white',fontSize:22,fontWeight:'700'}}>{data?.today?.[k] ?? '--'}</Text></View>)}</View>
    <View style={{backgroundColor:'rgba(30,41,59,0.7)',borderRadius:14,padding:14}}><Text style={{color:'white'}}>AI Insight</Text><Text style={{color:'#C4B5FD',marginTop:8}}>{data?.ai_insight ?? 'Loading...'}</Text></View>
    <TouchableOpacity onPress={()=>{logout();router.replace('/login')}}><Text style={{color:'#F87171',textAlign:'center',marginTop:20}}>Logout</Text></TouchableOpacity>
  </ScrollView></LinearGradient>
}
