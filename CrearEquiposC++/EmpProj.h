class EmpProj {
    private:
        int id_emp;
        int proj_role;
        bool comp_hr;
        int id_proj;
    public:
        EmpProj();
        EmpProj(int idEmp, int projRole, bool compHr, int idProj);
        void SetEmpProj(int id_emp, int proj_role, bool comp_hr, int id_proj);
        
        int getIdProj() { return id_proj; }
        int getRole() { return proj_role; }
};

EmpProj::EmpProj() { }

EmpProj::EmpProj(int idEmp, int projRole, bool compHr, int idProj){
    id_emp = idEmp;
    proj_role = projRole;
    comp_hr = compHr;
    id_proj = idProj;
}


void EmpProj::SetEmpProj(int idEmp, int projRole, bool compHr, int idProj){
    id_emp = idEmp;
    proj_role = projRole;
    comp_hr = compHr;
    id_proj = idProj;
}