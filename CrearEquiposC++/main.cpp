#include <iostream>
#include <vector>
using namespace std;

#include "EmpProj.h"
#include "EmpTeam.h"


int main() {
    vector< vector<EmpProj> > empProj;
    vector<EmpProj> auxVecEmpTeam;
    vector<EmpTeam> empTeam;
    EmpProj auxEmpProj;
    EmpTeam auxEmpTeam;
    auxEmpProj.SetEmpProj(1, 1, true, 1);

    // crear datos falsos
    //role: 0=leader, 1=peer, 2=team
    //projrole: 1=leader
    int cont = 1;
    int projRole = 0;
    bool compHr = true;

    for (int i = 1; i < 6; i++){
        for (int j = 0; j<10; j++){
            if (j==0){
                projRole = 1;
            } else {
                projRole = 0;
            }
            if (j == 7){
                compHr = false;
            } else {
                projRole = true;
            }
            auxEmpProj.SetEmpProj(cont, projRole, compHr, i);
        }
    }



}