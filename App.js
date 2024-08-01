import React, { useState, useEffect } from 'react';
import { FilterMatchMode } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
import pixel from './Pixel.jpg';
import { Paginator } from 'primereact/paginator';
import axios from "axios";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import 'primeicons/primeicons.css';

const App = () => {
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const [customers, setCustomers] = useState([]);
  const [filters, setFilters] = useState({
    firstName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    lastName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    gender: { value: null, matchMode: FilterMatchMode.EQUALS },
    address: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [loading, setLoading] = useState(true);
  const [genders] = useState(['male', 'female']);
  const [count, setCount] = useState(0);
  const [sortField, setSortField] = useState('id');
  const [sortOrder, setSortOrder] = useState(1);

  const onPageChange = (event) => {
    setFirst(event.first);
    setRows(event.rows);
  };

  const onSort = (e) => {
    setSortField(e.sortField);
    setSortOrder(e.sortOrder);
  };

  const onFilterChange = (field, value, matchMode) => {
    let _filters = { ...filters };
    _filters[field] = { value, matchMode };

    setFilters(_filters);
  };

  const getData = async () => {
    try {
      const filterParams = {};
      Object.keys(filters).forEach((key) => {
        if (filters[key].value) {
          filterParams[key] = filters[key].value;
          console.log('Filter Params:', filterParams);
        }
      });
      const response = await axios.get('https://dummyjson.com/users', {
        params: {
          limit: rows,
          skip: first,
          sort: `${sortField}:${sortOrder === 1 ? 'asc' : 'desc'}`,
          ...filterParams,
        }
      });

      const flattenedData = response.data.users.map(user => ({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        age: user.age,
        gender: user.gender,
        email: user.email,
        address: `${user.address.city}, ${user.address.state}`,
        companyName: user.company.name,
      }));

      setCustomers(flattenedData);
      setCount(response?.data?.total);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [first, rows, sortField, sortOrder, filters]);

  const renderHeader = () => {
    return (
      <div className='custom-Align'>
        <div className='Cust-Text'> Employee Data</div>
      </div>
    );
  };

  const genderBodyTemplate = (rowData) => {
    return (
      <Tag value={rowData.gender} severity={rowData.gender === 'male' ? 'info' : 'success'} />
    );
  };

  const genderRowFilterTemplate = (options) => {
    return (
      <Dropdown value={options.value} options={genders} onChange={(e) => onFilterChange('gender', e.value, FilterMatchMode.EQUALS)} placeholder=" Gender" className="p-column-filter" showClear />
    );
  };

  const countryRowFilterTemplate = (options) => {
    return (
      <InputText value={options.value} onChange={(e) => onFilterChange('address', e.target.value, FilterMatchMode.CONTAINS)} placeholder=" Country" className="p-column-filter" />
    );
  };

  const header = renderHeader();
  return (
    <div className=''>
      <div className='Custom-Navbar'>
        <div>
          <img src={pixel} alt="Pixel" className='custom-img' />
        </div>
        <div className='custom-Icon'>
          <i className=' pi pi-bars '></i>
        </div>
      </div>
      <div className="datatable-responsive-demo customTable custompadding">
        <DataTable value={customers}
          showGridlines
          stripedRows
          dataKey="id"
          filters={filters}
          filterDisplay="row"
          loading={loading}
          header={header}
          emptyMessage="No users found."
          sortField={sortField}
          sortOrder={sortOrder}
          onSort={onSort}
          onFilter={(e) => onFilterChange(e.target.value)}>
          <Column field="id" header="ID" sortable style={{ minWidth: '4rem' }} />
          <Column field="firstName" header="First Name" sortable style={{ minWidth: '4rem' }} />
          <Column field="lastName" header="Last Name" sortable style={{ minWidth: '4rem' }} />
          <Column field="age" header="Age" sortable style={{ minWidth: '4rem' }} />
          <Column field="gender" header="Gender" sortable body={genderBodyTemplate} filter filterElement={genderRowFilterTemplate} style={{ minWidth: '4rem' }} />
          <Column field="address" header="Country" sortable filter filterElement={countryRowFilterTemplate} style={{ minWidth: '4rem' }} />
          <Column field="email" header="Email" sortable style={{ minWidth: '10rem' }} />
        </DataTable>
        <Paginator first={first} rows={rows} totalRecords={count} rowsPerPageOptions={[10, 20, 30]} onPageChange={onPageChange} />
      </div>
    </div>
  );
};

export default App;


