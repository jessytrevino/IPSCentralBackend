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

EmpTeam::EmpTeam(int idTeam, int idEmp, int stat, int r ){
    id_team = idTeam;
    id_emp = idEmp;
    status = stat;
    role = r;
}
