import {createContext,useContext,useState,useEffect} from 'react';

const AuthContext=createContext();

export const useAuth=()=>{
    const context = useContext(AuthContext);
    if(!context){
      
        throw new Error ("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider=({children})=>{
    const [user,setUser]=useState({name: "RFP User", role: "Project Manager"}); 
    const [loading,setLoading]=useState(false); 
    const [isAuthenticated,setIsAuthenticated]=useState(true); 

    const updateUser=(updatedUserData)=>{
       
        const newUserData={...user, ...updatedUserData};
        
        setUser(newUserData);
    }

    const value={
        user,
        loading,
        isAuthenticated,
        login: () => console.log('Login not required for this app.'),
        logout: () => console.log('Logout not required for this app.'),
        updateUser,
    }
    
    return <AuthContext.Provider value={value}> {children}</AuthContext.Provider>
    
}