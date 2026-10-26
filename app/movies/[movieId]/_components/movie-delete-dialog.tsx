"use client";

import { deleteMovie } from "@/actions/delete-action";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { startTransition, useActionState } from "react";

interface MovieDeleteDialogProps {
    movieId: string;
    redirectTo?: string;
}

export function MovieDeleteDialog({
    movieId,
    redirectTo,
}: MovieDeleteDialogProps) {
    const [_state, action, pending] = useActionState(deleteMovie.bind(null, movieId, redirectTo), undefined); // exptectedd 2 arguemnts but got 3

    function handleClick() {
        startTransition(action);
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger render={<Button variant="destructive" />}>
                Delete Movie
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                       Delete movie?
                    </AlertDialogTitle>
                     <AlertDialogDescription>
                        Are you sure you want to delete this movie? This action cannot be undone.
                     </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={pending}>
                        No, cancel
                    </AlertDialogCancel>
                    <AlertDialogAction 
                    disabled={pending} 
                    variant="destructive" 
                    onClick={handleClick}>
                        Yes, delete movie
                        {pending && <Spinner />}</AlertDialogAction>                
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

    )
}