import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("Program")
      .select("*")
      .order("id", { ascending: true });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Gagal mengambil data program" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const body = await request.json();

  if (!body.nama_program || !body.deskripsi_program) {
    return NextResponse.json(
      {
        error:
          "Diperlukan 'nama_program', dan 'deskripsi_program' untuk melanjutkan.",
      },
      { status: 400 }
    );
  }

  try {
    const { data, error } = await supabase
      .from("Program")
      .insert([body])
      .select();

    if (error) throw error;
    return NextResponse.json(data[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Gagal membuat program" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const supabase = await createClient();
  const body = await request.json();

  if (!body.id || !body.nama_program || !body.deskripsi_program) {
    return NextResponse.json(
      {
        error:
          "Diperlukan 'id', 'nama_program', dan 'deskripsi_program' untuk melanjutkan.",
      },
      { status: 400 }
    );
  }

  try {
    const { data, error } = await supabase
      .from("Program")
      .update(body)
      .eq("id", body.id)
      .select();

    if (error) throw error;
    return NextResponse.json(data[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Gagal memperbarui program" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const supabase = await createClient();
  const { id } = await request.json();

  if (!id) {
    return NextResponse.json(
      { error: "Kamu harus memasukkan 'id' untuk penghapusan" },
      { status: 400 }
    );
  }
  try {
    const { error } = await supabase.from("Program").delete().eq("id", id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Gagal menghapus program" },
      { status: 500 }
    );
  }
}
