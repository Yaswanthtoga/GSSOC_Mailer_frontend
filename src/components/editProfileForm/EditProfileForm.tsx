"use client"

import { z } from "zod"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"


import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"


import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useSelector } from "react-redux"

import { RootState } from "@/redux/store"

const profileSchema = z.object({
    id:z.string(),
    name:z.string({required_error:"name is required"}).min(2,'name should not be empty or less than 2 letter').max(50),
    email:z.string().email(),
    company:z.string().min(2).max(50),
    designation:z.string().min(2).max(50),
})



export function EditProfile(values: z.infer<typeof profileSchema>,userid:string, rowInf:any) {

    // write an api call to update the profile 
    fetch("https://api.api-communet.tech/api/v1/mail", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            userId: userid,
            data: {
                _id: rowInf.id,
                email: values.email ? values.email : rowInf.email,
                currentDesignation: values.designation ? values.designation : rowInf.currentDesignation,
                name: values.name ? values.name : rowInf.name,
                company: values.company ? values.company : rowInf.company,
            },
        }),
    })
        .then((response) => response.json())
        .then((data) => {
            console.log("Success:", data);
        })
        .catch((error) => {
            console.error("Error:", error);
        });

}

export default function EditProfileForm(rowData:any) {
    
    const userid = useSelector((state: RootState) => state.userData.userId); 


    const form = useForm<z.infer<typeof profileSchema>>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: "",
            email: "",
            company: "",
            designation: ""
        },
    })

    // 2. Define a submit handler.
    function submithandler(values: z.infer<typeof profileSchema>,userid:string) {
        console.log("these are the Updte form values",values,userid,rowData)
        const rowInf = rowData.row
        EditProfile(values,userid,rowInf)
    }

    return (<Dialog>
        <DialogTrigger asChild>
            <Button variant={"default"} className='h-[100%] w-[100px]  text-black rounded-sm  flex justify-center items-center gap-[10px] bg-white active:bg-white'> 
              Edit
            </Button>
        </DialogTrigger>
        <DialogContent className="W-[300px] sm:max-w-[425px] h-[500px]">
            <DialogHeader>
                <DialogTitle>Edit profile</DialogTitle>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={(event) => {
                    console.log('submitted')
                    event.preventDefault()
                    console.log(form.getValues())
                    submithandler(form.getValues(),userid)
                }} className="space-y-4 flex flex-col ">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter the Name for the profile" {...field} className="w-[100%]" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                

                                <FormControl>
                                    <Input
                                        placeholder="email account of profile"
                                        {...field}
                                        className=" w-[100%] "
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                   <FormField
                        control={form.control}
                        name="company"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Company</FormLabel>
                                <FormControl>
                                    <Input placeholder="Company of profile" {...field} className="w-[100%]" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="designation"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Designation</FormLabel>
                                <FormControl>
                                    <Input placeholder="Designation fo profile" {...field} className="w-[100%]" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="w-[100%] flex justify-center items-center">
                    <Button type="submit" className="w-[20%] " onClick={(event)=>{
                        event.preventDefault()
                        submithandler(form.getValues(),userid)
                    }}>Update</Button>
                       
                    </div>
                </form>
            </Form>
        </DialogContent>
    </Dialog>
    )
}

