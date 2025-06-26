import './App.css'
import { useEffect, useState, useRef } from 'react';
import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
function App() {

  const dropdownRefs = useRef([]);
  const buttonRefs = useRef([]);

  const [noOfUsers, setNoOfUsers] = useState(2)

  const [currentId, setCurrentId] = useState(2)

  const [toggleDropdownIndex, setToggleDropdownIndex] = useState('x');
  const [resultVisibility, setResultVisibility] = useState(false);

  const [userData, setUserData] = useState(
    {
      0: "",
      1: ""
    })

  const [payData, setPayData] = useState([
    {
      id: '0',
      payTo: []
    },
    {
      id: '1',
      payTo: []
    },
  ])

  const [expenseData, setExpenseData] = useState([
    {
      id: '0',
      expenses: [[0, Object.keys(userData).map(e => { return e })]]
    },
    {
      id: '1',
      expenses: [[0, Object.keys(userData).map(e => { return e })]]
    }]);

  function addUser() {
    const newUserId = String(currentId);

    // 1. Add to userData
    setUserData(prev => ({
      ...prev,
      [newUserId]: ""
    }));

    // 2. Add to expenseData and update existing users' expenses
    setExpenseData(prev => {

      const updated = prev.map(user => {
        const updatedExpenses = user.expenses.map(expense => {
          if (expense[1].length === noOfUsers) {
            return [expense[0], [...expense[1], newUserId]];
          }
          return expense
        });
        return { ...user, expenses: updatedExpenses };
      });

      const newUser = {
        id: newUserId,
        expenses: []
      };

      return [...updated, newUser];
    });

    // 3. Add to payData
    setPayData(prev => [
      ...prev,
      {
        id: newUserId,
        payTo: []
      }
    ]);

    // 4. Update counters AFTER all the above
    setNoOfUsers(prev => prev + 1);
    setCurrentId(prev => prev + 1);
  }


  function clear() {
    setResultVisibility(false)

    setExpenseData([
      {
        id: 0,
        name: "",
        expenses: [[0, Object.keys(userData).map(e => { return e })]]
      },
      {
        id: 1,
        name: "",
        expenses: [[0, Object.keys(userData).map(e => { return e })]]
      }
    ]);

    setPayData([
      {
        id: '0',
        payTo: []
      },
      {
        id: '1',
        payTo: []
      },
    ])

    setUserData(
    {
      0: "",
      1: ""
    }
    )

    // formRef.current.reset();
  }

  const removeUser = (index) => {
    // console.log(typeof (index))
    // console.log(index)

    if (Number(index) + 1 === currentId) {
      setCurrentId(prev => prev - 1);
    }


    const updatedExpenseData = expenseData.map(user => {
      const updatedExpenses = user.expenses.map(expense => {
        const filteredIds = expense[1].filter(id => id !== index);
        return [expense[0], filteredIds];
      });

      return {
        ...user,
        expenses: updatedExpenses
      };
    });

    setExpenseData(updatedExpenseData);

    setNoOfUsers(prev => prev - 1)
    setPayData(prev => prev.filter(user => user.id !== index))
    setExpenseData(prev => prev.filter(user => user.id !== index))
    setUserData(prev => Object.fromEntries(Object.entries(prev).filter(([key]) => key !== index)))
  }

  const removeExpense = (userId, expIndex) => {
    const updatedExpenseData = expenseData.map(user => {
      if (user.id !== userId) return user; // keep other users unchanged

      // Remove expense at expIndex for the matched user
      const updatedExpenses = user.expenses.filter((_, i) => i !== expIndex);

      return {
        ...user,
        expenses: updatedExpenses
      };
    });

    setExpenseData(updatedExpenseData);
  };


  function handleUserChange(index, e) {
    setResultVisibility(false);
    // console.log("somethinf")

    const updatedUserData = { ...userData };
    updatedUserData[index] = e.target.value;
    setUserData(updatedUserData);
  }

  const addExpense = (index) => {
    setResultVisibility(false)

    let newExpense = [0, Object.keys(userData).map(e => { return e })]
    const updatedexpenseData = [...expenseData];
    updatedexpenseData[index] = { ...expenseData[index] };
    updatedexpenseData[index].expenses = [...expenseData[index].expenses];

    updatedexpenseData[index].expenses.push(newExpense);
    setExpenseData(updatedexpenseData);
  }



  const handleCheckboxChange = (index, expIndex, value) => {
    // console.log('user id is ', value, expIndex, index);
    setResultVisibility(false)

    // Deep-ish copy (depends on structure of expenseData)
    const updatedexpenseData = [...expenseData];
    updatedexpenseData[index] = { ...expenseData[index] };
    updatedexpenseData[index].expenses = [...expenseData[index].expenses];


    let prev = updatedexpenseData[index].expenses[expIndex][1];

    // Ensure `prev` is a new array before modifying
    const updatedList = prev.includes(value)
      ? prev.filter(v => v !== value)
      : [...prev, value];

    updatedexpenseData[index].expenses[expIndex] = [
      ...updatedexpenseData[index].expenses[expIndex],
    ]; // clone inner expense entry

    updatedexpenseData[index].expenses[expIndex][1] = updatedList;

    setExpenseData(updatedexpenseData);
  };

  const handleSelectEveryoneToggle = (index, expIndex) => {
    const updatedexpenseData = [...expenseData];
    updatedexpenseData[index] = { ...expenseData[index] };
    updatedexpenseData[index].expenses = [...expenseData[index].expenses];


    let updated = updatedexpenseData[index].expenses[expIndex][1];

    // const updated = [...prev];
    const allSelected = updated.length === noOfUsers;

    updatedexpenseData[index].expenses[expIndex][1] = allSelected ? [] : Object.keys(userData).map((e) => { return (String(e)) });
    // updatedexpenseData[index].expenses[expIndex][1] =  [] ;

    setExpenseData(updatedexpenseData);
  };


  const handleExpenseAmountChange = (index, expIndex, value) => {
    setResultVisibility(false)

    const updatedexpenseData = [...expenseData];
    updatedexpenseData[index].expenses[expIndex][0] = Number(value)
    setExpenseData(updatedexpenseData);
  };

  function addPayer(payer, receiver, amountToPay) {
    setPayData(prevData =>
      prevData.map(obj => {
        if (obj.id !== payer) return obj; // not the receiver, return as is


        // Find if payTo already has an entry with user.id
        const payToIndex = obj.payTo.findIndex(entry => entry.id == receiver);

        if (payToIndex !== -1) {
          // Update existing entry's amount
          const updatedPayTo = obj.payTo.map((entry, idx) =>
            idx == payToIndex
              ? { ...entry, amount: entry.amount + amountToPay }  // or amount + some variable
              : entry
          );
          return { ...obj, payTo: updatedPayTo };
        } else {
          // Add new entry to payTo array
          return {
            ...obj,
            payTo: [...obj.payTo, { id: receiver, amount: amountToPay }]
          };
        }
      })
    );
  }

  function optimise() {
    setPayData(prevData => {

      let newData = prevData.map(obj => ({
        ...obj,
        payTo: obj.payTo.map(entry => ({ ...entry }))
      }));

      for (let i = 0; i < newData.length; i++) {
        for (let j = 0; j < newData.length; j++) {
          if (i === j) continue;

          const outer = newData[i];
          const inner = newData[j];

          const outerToInner = outer.payTo.find(p => p.id === inner.id);
          const innerToOuter = inner.payTo.find(p => p.id === outer.id);

          if (outerToInner && innerToOuter) {
            if (outerToInner.amount > innerToOuter.amount) {
              outerToInner.amount -= innerToOuter.amount;

              // Remove innerToOuter from inner.payTo
              inner.payTo = inner.payTo.filter(p => p.id !== outer.id);
            } else if (outerToInner.amount < innerToOuter.amount) {
              innerToOuter.amount -= outerToInner.amount;

              // Remove outerToInner from outer.payTo
              outer.payTo = outer.payTo.filter(p => p.id !== inner.id);
            } else {
              // Equal amounts: remove both
              outer.payTo = outer.payTo.filter(p => p.id !== inner.id);
              inner.payTo = inner.payTo.filter(p => p.id !== outer.id);
            }
          }
        }
      }

      return newData;
    })
  }

  function processUserGroups(userGroups, groupIds, userId, amount) {

    const key = groupIds.sort().join('')

    // console.log(groupIds)

    // console.log("key is ", key)

    if (!userGroups[key]) {
      userGroups[key] = groupIds.map(id => ({ id, expense: 0, total: 0 }));
    }

    const group = userGroups[key];
    const user = group.find(u => u.id === userId);
    if (user) {
      user.expense += amount;
      user.total = user.expense;
    }
    // Can be discarded or reused
  }


  function smartSplit(storedarray) {
    // console.log("function called")
    // storedarray = JSON.parse(localStorage.getItem("users"))
    // console.log(storedarray)
    // isupdate = true
    let usercount = storedarray.length

    // if (isupdate) {
    // console.log(storedarray)
    // share = 0
    let totalExpense = 0
    for (let i = 0; i < usercount; i++) {
      totalExpense += storedarray[i].expense
    }

    let share = Math.round(totalExpense / usercount)
    // const newline = document.createElement("p");
    // resultDiv.appendChild(newline);
    // newline.innerHTML = "Share is " + share
    // console.log("Share is " + share)
    // console.log("Usercount is " + usercount)

    for (let i = 0; i < usercount; i++) {
      if (storedarray[i].total > share) {
        for (let j = 0; j < usercount; j++) {
          if (storedarray[i].total > share && storedarray[j].total < share) { //
            let temp = storedarray[i].total - share
            // const newline = document.createElement("p");
            // resultDiv.appendChild(newline);
            if ((storedarray[j].total + temp) > share) {
              //  newline.innerHTML=storedarray[j].id + " Gives " + (share - storedarray[j].total) + " to " + storedarray[i].id
              // console.log(storedarray[j].id + " Gives " + (share - storedarray[j].total) + " to " + storedarray[i].id)
              addPayer(storedarray[j].id, storedarray[i].id, share - storedarray[j].total)
              storedarray[i].total = storedarray[i].total - (share - storedarray[j].total)
              storedarray[j].total += (share - storedarray[j].total)
            }
            else {
              //  newline.innerHTML=storedarray[j].id + " Gives " + (temp) + " to " + storedarray[i].id
              // console.log(storedarray[j].id + " Gives " + (temp) + " to " + storedarray[i].id)
              addPayer(storedarray[j].id, storedarray[i].id, temp)
              storedarray[j].total += (temp)
              storedarray[i].total = storedarray[i].total - (temp)
            }
          }
        }
      }
    }
    // isupdate = false
    // }
  }


  function calculate() {

    setPayData(prevData =>
      prevData.map(item => ({
        ...item,
        payTo: [] // clear payTo array
      }))
    );


    const userGroups = {};

    for (const user of expenseData) {
      // console.log(user)
      for (const expense of user.expenses) {
        // console.log(typeof (expense[0]))

        if (expense[0] > 0) {

          if (expense[1].includes(user.id) && expense[1].length > 1) {
            processUserGroups(userGroups, expense[1], user.id, expense[0])
          }

          else if(!expense[1].includes(user.id)) {
            // console.log('in the else')
            for (const payer of expense[1]) {
              let amountToPay = expense[0] / expense[1].length
              addPayer(payer, user.id, amountToPay)
            }
          }
        }
      }
    }

    Object.values(userGroups).forEach(value => {
      // console.log(value);
      smartSplit(value)
    });
    // console.log(userGroups)
    // smartSplit();
    optimise()

    setResultVisibility(true)
    // console.log(userGroups)
  }




  useEffect(() => {
    function handleClickOutside(event) {
      if (toggleDropdownIndex === 'x') return;

      const dropdown = dropdownRefs.current[toggleDropdownIndex];
      const button = buttonRefs.current[toggleDropdownIndex];

      if (
        dropdown &&
        !dropdown.contains(event.target) &&
        button &&
        !button.contains(event.target)
      ) {
        // console.log('actually clicked')
        setToggleDropdownIndex('x'); // Close dropdown
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [toggleDropdownIndex]);

  const getIntials = (text) => {
    // console.log(text)
    const n = text.trim().split(' ').filter(Boolean);
    return n.length === 0 ? '' : n.length === 1 ? n[0][0].toUpperCase() : (n[0][0] + n[n.length - 1][0]).toUpperCase();
  }

  useEffect(()=>{
    console.log(userData)
    console.log(expenseData)
    console.log(payData)
  },[payData,expenseData,userData])

  return (
    <div className='min-h-screen w-[100vw] bg-emerald-50 flex justify-center'>
      {/* Main container - centered with max width */}
      <div className='w-full max-w-md mx-auto px-4 py-6'>

        {/* Header */}
        <div className='text-center mb-6'>
          <h1 className='text-4xl font-bold text-red-800 mb-2'>Karkoon</h1>
          <p className='text-lg '>A smart bill splitter</p>
          <p className='text-s text-gray-500 mt-1'>Just add everything here, and you'll be good to go</p>
        </div>

        {/* Action Buttons */}
        <div className='flex justify-between gap-3 mb-6'>
          <button
            className='flex-1 bg-blue-500 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors'
            onClick={addUser}
          >
            Add User
          </button>
          <button
            className='flex-1 bg-green-500 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors'
            onClick={() => calculate()}
          >
            Calculate
          </button>
          <button
            className='flex-1 bg-red-500 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors'
            onClick={clear}
          >
            Clear
          </button>
        </div>

        {/* Results Section */}
        <div className='mb-6 bg-white rounded-lg shadow-sm border'>
          <button
            className="w-full flex items-center justify-between px-4 py-3 text-left font-medium text-gray-700 transition-colors"
            onClick={() => setResultVisibility(prev => !prev)}
          >
            <span>Payment Summary/Result</span>
            <span className='text-lg'>{resultVisibility ? '▲' : '▼'}</span>
          </button>

          <div className={`grid duration-300 ease-out ${resultVisibility ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
            <div className='overflow-hidden'>
              <div className='px-4 pb-4'>
                <div className='text-center py-1 text-gray-500'>Total Users are {noOfUsers}</div>
                {payData.some(user => user.payTo.length > 0) ? (
                  payData.map((user, userIndex) => {
                    return (
                      user.payTo.length > 0 && (
                        <div key={user.id} className='mb-3 p-3 shadow-sm rounded-lg'>
                          <div className='font-medium text-gray-800 mb-2 text-md'>
                            {userData[user.id] ? userData[user.id] : `User ${+user.id + 1}`} needs to pay:
                          </div>
                          {user.payTo.map((receiver, recIndex) => (
                            <div key={recIndex} className='text-sm text-gray-700 ml-2'>
                              ₹{receiver.amount} to {userData[receiver.id] ? userData[receiver.id] : `User ${+receiver.id + 1}`}
                            </div>
                          ))}
                        </div>
                      )
                    );
                  })
                ) : (
                  <div className='text-center py-1 text-gray-500'>
                    <p>Everything is balanced! 🎉</p>
                    <p className='text-xs mt-1'>Nobody needs to pay anyone</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Users and Expenses */}
        <div className='space-y-4'>
          {expenseData.map((user, index) => {
            return (
              <div key={user.id} className='bg-white rounded-lg shadow-sm border'>

                {/* User Header */}
                <div className='px-4 py-3 rounded-t-lg bg-gray-50 border-b shadow-md'>
                  <div className='flex items-center justify-between mb-3'>
                    <div className='flex items-center gap-3 flex-1'>
                      <div className='w-10 h-10 rounded-full bg-blue-100 text-blue-900 font-sans flex items-center justify-center font-bold'>
                        {userData[user.id] ? getIntials(userData[user.id]) : getIntials(`User ${+user.id + 1}`)}
                      </div>
                      <input
                        type="text"
                        placeholder={`Enter name for user ${Number(user.id) + 1}`}
                        className='flex-1 px-3 py-2 border rounded-lg text-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        value={userData[user.id] || ''}
                        onChange={(e) => handleUserChange(user.id, e)}
                      />
                    </div>
                    <button
                      className='ml-3 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors'
                      onClick={() => removeUser(user.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className='flex justify-between items-center'>
                    <span className='text-md font-semibold text-black'>Total Expenses:</span>
                    <span className='font-bold text-xl text-red-900 mr-1 font-sans'>
                      ₹{user.expenses.reduce((total, exp) => total + exp[0], 0)}
                    </span>
                  </div>
                </div>

                {/* Expenses */}
                <div className='p-4 space-y-3'>
                  {user.expenses.map((expense, expIndex) => {
                    const isEveryoneSelected = expense[1].length === noOfUsers;
                    return (
                      <div key={expIndex} className=' rounded-lg py-3 px-2'>
                        <div className='relative'>

                          {/* Main expense row */}
                          <div className='flex items-center gap-2 mb-3'>
                            <button
                              className='text-white bg-red-700 w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors flex-shrink-0'
                              onClick={() => removeExpense(user.id, expIndex)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>

                            <input
                              type="text"
                              placeholder='Expense Description (Optional)'
                              className='flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                            />

                            <input
                              type="text"
                              placeholder='₹ Amount'
                              className='w-20 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                              onChange={(e) => handleExpenseAmountChange(index, expIndex, e.target.value)}
                            />
                          </div>

                          {/* Split with section */}
                          <div className='flex items-center justify-between'>

                            <div className='flex items-center gap-2 flex-1 min-w-0'>
                              <span className='text-sm text-gray-600 whitespace-nowrap'>Split with:</span>

                              <div className='flex items-center min-w-0'>
                                {expense[1].length === 0 ? (
                                  <span className='text-xs text-gray-500'>None selected (excluded from calculations)</span>
                                ) : (
                                  <div className='flex items-center'>
                                    {expense[1].slice(0, 8).map((splitUser, expUserIndex) => (
                                      <div
                                        key={splitUser}
                                        className='w-8 h-8 rounded-full font-semibold bg-blue-100 border-2 border-blue-300 flex items-center justify-center text-blue-800 font-semibold text-xs'
                                        style={{
                                          marginLeft: expUserIndex > 0 ? '-8px' : '0',
                                          zIndex: 8 - expUserIndex,
                                        }}
                                      >
                                        {userData[splitUser] ? getIntials(userData[splitUser]) : getIntials(`User ${+splitUser + 1}`)}
                                      </div>
                                    ))}

                                    {expense[1].length > 10 && (
                                      <div
                                        className="w-8 h-8 rounded-full bg-gray-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                                        style={{
                                          marginLeft: '-8px',
                                          zIndex: 0,
                                        }}
                                      >
                                        +{expense[1].length - 8}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>

                            <button
                              ref={el => buttonRefs.current[`${index}${expIndex}`] = el}
                              className="ml-2 p-2 border rounded-lg bg-white hover:bg-gray-50 transition-colors flex-shrink-0"
                              onClick={() => `${index}${expIndex}` === toggleDropdownIndex ? setToggleDropdownIndex('x') : setToggleDropdownIndex(`${index}${expIndex}`)}
                            >
                              {`${index}${expIndex}` === toggleDropdownIndex ?
                                <ChevronUp className="w-4 h-4" /> :
                                <ChevronDown className="w-4 h-4" />
                              }
                            </button>
                          </div>

                          {/* Dropdown */}
                          <div
                            ref={el => dropdownRefs.current[`${index}${expIndex}`] = el}
                            className="absolute top-full left-0 right-0 z-100 bg-white rounded-lg shadow-lg mt-1"
                          >
                            <div className={`grid duration-300 ease-out ${`${index}${expIndex}` === toggleDropdownIndex ? 'grid-rows-[1fr] border' : 'grid-rows-[0fr] border-0'}`}>
                              <div className='overflow-hidden'>
                                <div className='p-2'>
                                  <label className="flex items-center px-3 py-2 hover:bg-gray-100 rounded cursor-pointer">
                                    <input
                                      type="checkbox"
                                      className="mr-3"
                                      checked={isEveryoneSelected}
                                      onChange={() => handleSelectEveryoneToggle(index, expIndex)}
                                    />
                                    <span className='font-medium'>Everyone</span>
                                  </label>

                                  <div className='border-t mt-2 pt-2'>
                                    {Object.entries(userData).map(([id, name]) => (
                                      <label key={id} className="flex items-center px-3 py-2 hover:bg-gray-100 rounded cursor-pointer">
                                        <input
                                          type="checkbox"
                                          checked={expense[1].includes(id)}
                                          onChange={() => handleCheckboxChange(index, expIndex, id)}
                                          className="mr-3"
                                        />
                                        <span className='text-sm truncate'>
                                          {name || `User ${+id + 1}`}
                                        </span>
                                      </label>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Add Expense Button */}
                  <button
                    className='w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors font-medium'
                    onClick={() => addExpense(index)}
                  >
                    + Add Expense
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  )
}

export default App
