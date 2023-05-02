import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useContext, useEffect } from "react";
import { Input, Textarea, Button } from "@material-tailwind/react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../context/authcontext";
import axios, { all } from "axios";
import {
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";

export default function CreateItemModal({
  itemModalOpen,
  setItemModalOpen,
  itemData,
  setRefresh,
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { pk } = useParams();
  const token = useContext(AuthContext);
  const [allergyList, setAllergyList] = useState("");
  const [itemAllergies, setItemAllergies] = useState([]);
  useEffect(() => {
    axios
      .get(`https://potluck.herokuapp.com/dietary-restrictions`, {
        headers: {
          "Content-Type": "applications/json",
          Authorization: token,
        },
      })
      .then((response) => {
        setAllergyList(response.data);
        console.log(response.data);
      });

    setTitle(itemData?.title || "");
    setDescription(itemData?.description || "");
    setItemAllergies(itemData?.dietary_restrictions_names ?? []);
  }, [itemData]);

  function handleCreateItem(i) {
    i.preventDefault();

    const options = {
      method: itemData ? "PATCH" : "POST",
      url: itemData
        ? `https://potluck.herokuapp.com/items/${itemData.pk}`
        : `https://potluck.herokuapp.com/events/${pk}/items`,
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      data: {
        title: title,
        description: description,
        dietary_restrictions_names: JSON.stringify(itemAllergies),
      },
    };

    axios
      .request(options)
      .then(function (response) {
        setRefresh((r) => !r);
        console.log(response.data);
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  const handleSelectAllergy = (event) => {
    const allergy = event.target.value;
    setItemAllergies(
      // On autofill we get a stringified value.
      typeof value === "string" ? allergy.split(",") : allergy
    );
  };

  if (allergyList)
    return (
      <>
        <Transition appear show={itemModalOpen} as={Fragment}>
          <Dialog as="div" className="relative z-20" onClose={setItemModalOpen}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-bold leading-6 text-gray-900 text-center"
                    >
                      {itemData ? "Edit" : "Add"} Item
                    </Dialog.Title>
                    <form onSubmit={(i) => handleCreateItem(i)}>
                      <div className="mt-3">
                        <Input
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          label="Item"
                          size="lg"
                        />
                      </div>
                      <div className="mt-2">
                        <Textarea
                          value={description}
                          className="mb-0"
                          onChange={(e) => setDescription(e.target.value)}
                          label="Description"
                          size="lg"
                        />
                      </div>
                      <div className=" mb-2">
                        <FormControl className="w-full">
                          <InputLabel
                            sx={{
                              fontSize: ".875rem",
                              color: "#607D8B",
                              borderRadius: ".375rem",
                            }}
                            id="select-label"
                          >
                            Dietary Categories
                          </InputLabel>
                          <Select
                            labelId="select-label"
                            multiple
                            value={itemAllergies}
                            onChange={handleSelectAllergy}
                            input={<OutlinedInput label="Dietary Categories" />}
                            renderValue={(selected) => selected.join(", ")}
                            // MenuProps={MenuProps}
                          >
                            {allergyList.map((allergy) => (
                              <MenuItem key={allergy.id} value={allergy.name}>
                                <Checkbox
                                  checked={
                                    itemAllergies.indexOf(allergy.name) > -1
                                  }
                                  sx={{
                                    "&.Mui-checked": {
                                      color: "#1E3A8A",
                                    },
                                  }}
                                />
                                <ListItemText primary={allergy.name} />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </div>

                      <div className="flex justify-center">
                        <Button
                          type="submit"
                          onClick={() => setItemModalOpen(false)}
                          className="w-32 bg-blue-900"
                        >
                          {itemData ? "Edit" : "Add"} Item
                        </Button>
                      </div>
                    </form>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </>
    );
}
