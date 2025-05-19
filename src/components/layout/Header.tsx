import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Briefcase, Mail, LogOut } from 'lucide-react';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="fixed top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur-sm">
      <div className="container flex h-14 items-center">
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="p-2 rounded-xl bg-primary/10 transition-all duration-300 group-hover:bg-primary/20">
            <Briefcase className="h-5 w-5 text-primary transition-all duration-300 group-hover:scale-110" />
          </div>
          <span className="font-semibold text-lg bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent tracking-tighter">
            Tigerjobs
          </span>
        </Link>
        
        {user && (
          <div className="flex items-center ml-auto space-x-4">
            <Button variant="ghost" size="sm" className="h-8 w-8 px-0" asChild>
              <Link to="/import">
                <Mail className="h-4 w-4 text-muted-foreground" />
              </Link>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.photoURL} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 z-50">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile">Profile Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => logout()} 
                  className="text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
