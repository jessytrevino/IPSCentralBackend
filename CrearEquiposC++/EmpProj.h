class EmpProj {
    private:
        int id_emp;
        int proj_role;
        int comp_hr;
        int id_proj;
    public:
        EmpProj();
        void SetEmpProj(int id_emp, int proj_role, int comp_hr, int id_proj);
        
        int getIdProj() { return id_proj; }
        int getRole() { return proj_role; }
};

EmpProj::EmpProj() { }

void EmpProj::SetEmpProj(int id_emp, int proj_role, int comp_hr, int id_proj){
    id_emp = id_emp;
    proj_role = proj_role;
    comp_hr = comp_hr;
    id_proj = id_proj;
}