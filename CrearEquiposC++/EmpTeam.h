class EmpTeam {
    private:
        int id_team;
        int id_emp;
        int status;
        int role;
    public:
        EmpTeam();
        EmpTeam(int id_team, int id_emp, int status, int role);

};

EmpTeam::EmpTeam() { }

EmpTeam::EmpTeam(int id_team, int id_emp, int status, int role ){
    id_team = id_team;
    id_emp = id_emp;
    status = status;
    role = role;
}