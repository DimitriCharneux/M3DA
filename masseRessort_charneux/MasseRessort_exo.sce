getd();

// MAILLAGE //
[ noeuds , elements ] = MSHLoader('rectangle1.msh');
numElements = size(elements,2);
numNoeuds = size(noeuds,2);     



[segments] = findSegments(elements)
numSegments = size(segments,2);


// parametres physiques
k=10000;
m=1;
g=-9.81;

// parametres temps
dt = 0.005;
T =  0.5;



// image de sortie
S = [];
S(1) = 'BMP\anim';
t=50;
S(2) = string(t);
S(3) = '.bmp';
k_t=0;


// vecteur des positions:
X_t = zeros(2*numNoeuds,1);
V_t = zeros(2*numNoeuds,1);


for i=1:numNoeuds
     X_t([2*i-1 2*i]) = [noeuds(1,i) ; noeuds(2,i)];
end
lo = [];
for i=1:numSegments
    i1 = segments(1,i);
    i2 = segments(2,i);
    lo(i) = norm(X_t([2*i1-1  2*i1]) - X_t([2*i2-1  2*i2]));
end


for time=0:dt:T,
    F_t = zeros(2*numNoeuds,1);

    // mouvement de translation uniforme à modifier
    //for i=1:numNoeuds
    //    X_t([2*i]) = X_t([2*i]) +0.2;
    //end
    for i=1:numSegments
        i1 = segments(1,i);
        i2 = segments(2,i);
        pos_a = X_t(2 * i1 -1 : 2 * i1);
        pos_b = X_t(2 * i2 -1 : 2 * i2);
        //l(s) = norm(pos_a - pos_b);

        l = norm(pos_b - pos_a);
        f = k * ( l - lo(i));
        n = (pos_b - pos_a) / norm(pos_a - pos_b);
        F_t(2 * i1 -1 : 2 * i1) = F_t(2 * i1 -1 : 2 * i1) + n*f
        F_t(2 * i2 -1 : 2 * i2) = F_t(2 * i2 -1 : 2 * i2) - n*f 
    end

    
  
    for i=1:numNoeuds
        
        acceleration = [F_t([2*i-1])/m ; g + F_t([2*i])/m];
        if noeuds(1,i) == 5 then 
            V_t([2*i-1]) = 0;
            V_t([2*i]) = 0;
        else
            V_t([2*i-1 2*i]) = V_t([2*i-1 2*i]) + acceleration * dt;
           
        end
        X_t([2*i-1 2*i]) = X_t([2*i-1 2*i]) + V_t([2*i-1 2*i]) * dt;
        
    end
    
    
    
    
        
    // déplacement du maillage
    noeuds_deplaces = noeuds;
    for i=1:numNoeuds,
      // deplacement selon x
      noeuds_deplaces(1,i) = X_t(2*i-1);
      // deplacement selon y
      noeuds_deplaces(2,i) = X_t(2*i);  
    end      
    
    clf;
    scf(0);
    draw_mesh( noeuds_deplaces, elements)
    a=get("current_axes");//get the handle of the newly created axes
    a.data_bounds=[-1,-1;10,10];
        
        
    k_t=k_t+1;    
    S(2) = string(k_t+99);
    xs2bmp(0,strcat(S));

    
    xpause(100000);


end

  
  
  
  

  



